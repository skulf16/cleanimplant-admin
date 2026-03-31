import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/layout/SessionProvider";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Header />
      <main className="flex-1 bg-[#f8f9fa]">{children}</main>
      <Footer />
    </SessionProvider>
  );
}
