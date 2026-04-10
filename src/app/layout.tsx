import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { auth } from "@/lib/auth";
import SessionProvider from "@/components/layout/SessionProvider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "mycleandent – Zahnärzte & Implantologen in Ihrer Nähe",
    template: "%s | mycleandent",
  },
  description:
    "Finden Sie zertifizierte Zahnärzte und Implantologen in Ihrer Nähe. Geprüfte Profile aus Deutschland, Österreich und der Schweiz.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://mycleandent.de"
  ),
  openGraph: {
    siteName: "mycleandent",
    locale: "de_DE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="de" className={`${montserrat.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
