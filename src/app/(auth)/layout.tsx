import Image from "next/image";
import Link from "next/link";

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
