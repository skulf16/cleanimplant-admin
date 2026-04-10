import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import WebinarForm from "@/components/admin/WebinarForm";

export default async function EditWebinarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const webinar = await prisma.webinar.findUnique({ where: { id } });
  if (!webinar) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/events" className="text-[13px] text-[#999] hover:text-[#30A2F1] mb-2 inline-block">
          ← Zurück zu Events & Webinare
        </Link>
        <h1 className="text-2xl font-bold text-[#333]">Webinar bearbeiten</h1>
      </div>

      <div className="max-w-2xl">
        <WebinarForm webinar={webinar} />
      </div>
    </div>
  );
}
