import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventForm from "@/components/admin/EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/events" className="text-[13px] text-[#999] hover:text-[#30A2F1] mb-2 inline-block">
          ← Zurück zu Events & Webinare
        </Link>
        <h1 className="text-2xl font-bold text-[#333]">Event bearbeiten</h1>
      </div>

      <div className="max-w-2xl">
        <EventForm event={event} />
      </div>
    </div>
  );
}
