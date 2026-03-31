import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <div className="py-6 px-4 text-center">
        <Link href="/">
          <span className="text-2xl font-bold text-[#2EA3F2]">
            my<span className="text-[#333]">clean</span>dent
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </div>
    </div>
  );
}
