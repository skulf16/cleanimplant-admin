import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${openSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
