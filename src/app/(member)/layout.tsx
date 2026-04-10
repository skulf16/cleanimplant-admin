import SessionProvider from "@/components/layout/SessionProvider";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen" style={{ backgroundColor: "#0c1d33" }}>
        {children}
      </div>
    </SessionProvider>
  );
}
