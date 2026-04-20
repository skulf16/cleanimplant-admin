import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="7cd84ce3-6171-4fbc-b1e3-8ae12d61657b"
        data-blockingmode="auto"
        strategy="afterInteractive"
      />
      <Header />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
      <GoogleAnalytics gaId="G-8TLP5P8F61" />
    </>
  );
}
