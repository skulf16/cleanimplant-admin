import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Alle Auth-Seiten (/login, /forgot, /register, /reset) sollen nicht indexiert
// werden – weder auf www.mycleandent.de, noch auf admin.* oder member.*.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #00385E 0%, #00527a 60%, #00385E 100%)" }}
    >
      {/* Logo */}
      <div className="mb-8">
        <Link href="/">
          <Image
            src="/cleanimplant-mycleandent-logo (1).png"
            alt="CleanImplant mycleandent"
            width={260}
            height={65}
            priority
            className="h-14 w-auto object-contain"
          />
        </Link>
      </div>

      {children}
    </div>
  );
}
