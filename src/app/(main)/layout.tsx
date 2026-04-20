import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

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
        strategy="beforeInteractive"
      />
      {/* Google Analytics 4 (gtag.js) */}
      <Script
        id="gtag-src"
        src="https://www.googletagmanager.com/gtag/js?id=G-8TLP5P8F61"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8TLP5P8F61');
        `}
      </Script>
      <Header />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
