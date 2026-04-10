import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, Plus } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#333]">Interne Benutzer</h1>
          <p className="text-[13px] text-[#999] mt-1">Mitarbeiter mit Admin-Zugang zum Dashboard</p>
        </div>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 bg-[#30A2F1] !text-white px-4 py-2 rounded text-[13px] font-semibold hover:bg-[#1a8fd8] transition-colors"
        >
          <Plus size={15} /> Benutzer anlegen
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">E-Mail</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Rolle</th>
              <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Angelegt</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-[14px] font-medium text-[#333]">{user.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1 text-[11px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full w-fit">
                    <ShieldCheck size={10} /> Admin
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#999]">
                  {new Date(user.createdAt).toLocaleDateString("de-DE")}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/admin/users/${user.id}`} className="text-[13px] text-[#30A2F1] hover:underline">
                    Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12 text-[#999] text-[14px]">Keine internen Benutzer gefunden.</div>
        )}
      </div>
      <p className="text-[12px] text-[#999] mt-3">{users.length} Benutzer</p>
    </div>
  );
}
