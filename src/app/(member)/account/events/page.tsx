import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import EventsTabs from "@/components/member/EventsTabs";

export default async function MemberEventsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  const [events, webinare, myRegistrations] = await Promise.all([
    prisma.event.findMany({ where: { active: true }, orderBy: { dateFrom: "asc" } }),
    prisma.webinar.findMany({ where: { active: true }, orderBy: { date: "asc" } }),
    userId
      ? prisma.webinarRegistration.findMany({ where: { userId }, select: { webinarId: true } })
      : [],
  ]);

  return (
    <EventsTabs
      events={events}
      webinare={webinare}
      userId={userId}
      userEmail={session?.user?.email ?? ""}
      userName={session?.user?.name ?? ""}
      registeredIds={myRegistrations.map(r => r.webinarId)}
    />
  );
}
