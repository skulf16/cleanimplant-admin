import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EinstellungenForm from "@/components/member/EinstellungenForm";

export default async function EinstellungenPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profiles: { select: { title: true, firstName: true, lastName: true }, take: 1 } },
  });

  if (!user) redirect("/login");

  const profile = user.profiles[0];

  return (
    <EinstellungenForm
      title={profile?.title ?? null}
      firstName={profile?.firstName ?? ""}
      lastName={profile?.lastName ?? ""}
      email={user.email}
    />
  );
}
