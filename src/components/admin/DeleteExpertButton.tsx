"use client";

import { deleteExpert } from "@/app/actions/experts";

export default function DeleteExpertButton({ id }: { id: string }) {
  return (
    <form action={deleteExpert.bind(null, id)}>
      <button
        type="submit"
        className="text-[13px] text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded transition-colors"
        onClick={e => { if (!confirm("Experten wirklich löschen?")) e.preventDefault(); }}
      >
        Experten löschen
      </button>
    </form>
  );
}
