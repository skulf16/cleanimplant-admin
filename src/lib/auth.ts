import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";
import { checkWordPressPassword } from "@/lib/phpass";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const login = (credentials.email as string).trim();

        // Support login with email OR username
        const user = await prisma.user.findFirst({
          where: login.includes("@")
            ? { email: login }
            : { OR: [{ username: login }, { email: login }] },
        });

        if (!user) return null;

        const password = credentials.password as string;

        // 1. bcrypt prüfen (normale Accounts)
        let valid = await bcrypt.compare(password, user.passwordHash);

        // 2. Falls nicht: WordPress phpass prüfen (migrierte Accounts)
        if (!valid && user.passwordHash.startsWith("$P$")) {
          valid = checkWordPressPassword(password, user.passwordHash);

          // Bei Erfolg: automatisch auf bcrypt upgraden
          if (valid) {
            const newHash = await bcrypt.hash(password, 12);
            await prisma.user.update({
              where: { id: user.id },
              data:  { passwordHash: newHash },
            });
          }
        }

        if (!valid) return null;

        return { id: user.id, email: user.email, role: user.role as string };
      },
    }),
  ],
});
