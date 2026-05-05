import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFoundBody from "@/components/layout/NotFoundBody";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description:
    "Diese Seite existiert nicht mehr oder wurde verschoben. Finden Sie hier Ihren CleanImplant-zertifizierten Zahnarzt oder stöbern Sie in unseren Artikeln.",
  robots: { index: false, follow: true },
};

/**
 * Globaler 404-Catch-All für URLs, die zu keiner Route in der App passen
 * (z. B. /foo/bar). Wird außerhalb jeder Route-Group gerendert, deshalb
 * kommen Header und Footer hier explizit dazu – sonst landet man auf
 * einer komplett ungestylten Seite.
 *
 * Innerhalb der (main)-Route-Group greift stattdessen (main)/not-found.tsx.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[72px]">
        <NotFoundBody />
      </main>
      <Footer />
    </>
  );
}
