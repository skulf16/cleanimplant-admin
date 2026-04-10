import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserEditForm from "@/components/admin/UserEditForm";
import { deleteUser } from "@/app/actions/users";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profiles: { select: { id: true, firstName: true, lastName: true, slug: true, city: true } },
    },
  });

  if (!user) notFound();

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <a href="/admin/users" className="text-[13px] text-[#999] hover:text-[#333] transition-colors">
            ← Zurück zur Liste
          </a>
          <h1 className="text-2xl font-bold text-[#333] mt-2">{user.email}</h1>
          <p className="text-[13px] text-[#999] mt-0.5">
            {user.role === "ADMIN" ? "Administrator" : "Mitglied"} · angelegt {new Date(user.createdAt).toLocaleDateString("de-DE")}
          </p>
        </div>
        <form action={async () => { "use server"; await deleteUser(id); }}>
          <button
            type="submit"
            className="text-[13px] text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded transition-colors"
          >
            Benutzer löschen
          </button>
        </form>
      </div>

      <UserEditForm user={user} />
    </div>
  );
}
