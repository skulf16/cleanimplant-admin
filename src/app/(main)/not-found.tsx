import type { Metadata } from "next";
import NotFoundBody from "@/components/layout/NotFoundBody";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description:
    "Diese Seite existiert nicht mehr oder wurde verschoben. Finden Sie hier Ihren CleanImplant-zertifizierten Zahnarzt oder stöbern Sie in unseren Artikeln.",
  robots: { index: false, follow: true },
};

// Fängt notFound()-Aufrufe innerhalb der (main)-Route-Group ab,
// z. B. nicht existierende Zahnarzt-Slugs unter /zahnarzt/[city]/[slug].
// Header/Footer kommen automatisch aus (main)/layout.tsx.
export default function NotFound() {
  return <NotFoundBody />;
}
