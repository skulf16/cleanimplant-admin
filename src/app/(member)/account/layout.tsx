import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MemberHeader from "@/components/member/MemberHeader";
import MemberTabs from "@/components/member/MemberTabs";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0c1d33" }}>
      <MemberHeader />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8">
        <MemberTabs />
      </div>
      <div className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-6xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
