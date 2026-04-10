import { prisma } from "@/lib/prisma";
import { Download, FileText, Play } from "lucide-react";

const BRAND_LABELS: Record<string, string> = {
  mycleandent:  "mycleandent",
  cleanimplant: "CleanImplant",
};

const BRAND_COLORS: Record<string, string> = {
  mycleandent:  "bg-[#30A2F1]/10 text-[#30A2F1]",
  cleanimplant: "bg-teal-500/10 text-teal-400",
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024)      return `${bytes} B`;
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1024/1024).toFixed(1)} MB`;
}

export default async function BibliothekPage() {
  const files = await prisma.mediaFile.findMany({
    where:   { category: "bibliothek" },
    orderBy: { createdAt: "desc" },
  });

  const pdfs   = files.filter(f => f.fileType === "application/pdf" || f.fileName.endsWith(".pdf"));
  const videos = files.filter(f => f.fileType.startsWith("video/"));
  const other  = files.filter(f => !f.fileType.startsWith("video/") && f.fileType !== "application/pdf" && !f.fileName.endsWith(".pdf"));

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-[18px] font-bold text-white mb-1">Bibliothek</h2>
        <p className="text-white/40 text-[13px]">Studien, Publikationen und exklusive Videoinhalte für Mitglieder.</p>
      </div>

      {files.length === 0 && (
        <div className="bg-white/5 rounded-xl p-16 text-center text-white/30 text-[14px]">
          Noch keine Inhalte verfügbar.
        </div>
      )}

      {/* ─── PDFs & Publikationen ─── */}
      {pdfs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300">
              Publikationen & PDFs
            </span>
            <span className="text-white/30 text-[12px]">{pdfs.length} {pdfs.length === 1 ? "Datei" : "Dateien"}</span>
          </div>

          <div className="space-y-3">
            {pdfs.map(file => (
              <div key={file.id} className="bg-white rounded-xl p-5 flex items-center gap-5">
                {/* PDF-Icon */}
                <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-red-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#333] text-[14px]">{file.title}</p>
                  {file.description && (
                    <p className="text-[12px] text-[#999] mt-0.5 line-clamp-2">{file.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {file.brands.map(br => (
                      <span key={br} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${BRAND_COLORS[br] ?? "bg-gray-100 text-gray-500"}`}>
                        {BRAND_LABELS[br] ?? br}
                      </span>
                    ))}
                    {file.fileSize ? (
                      <span className="text-[11px] text-[#bbb]">{formatSize(file.fileSize)}</span>
                    ) : null}
                  </div>
                </div>

                {/* Download */}
                <a
                  href={`/api/download?url=${encodeURIComponent(file.fileUrl)}&filename=${encodeURIComponent(file.title || file.fileName)}`}
                  className="flex items-center gap-2 bg-[#30A2F1] hover:bg-[#1a8fd8] text-white text-[12px] font-semibold px-4 py-2.5 rounded-lg transition-colors flex-shrink-0"
                >
                  <Download size={13} />
                  PDF öffnen
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Videos ─── */}
      {videos.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-300">
              Videos
            </span>
            <span className="text-white/30 text-[12px]">{videos.length} {videos.length === 1 ? "Video" : "Videos"}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {videos.map(file => (
              <div key={file.id} className="bg-white rounded-xl overflow-hidden">
                {/* Video-Player */}
                <div className="relative bg-black aspect-video">
                  <video
                    src={file.fileUrl}
                    controls
                    preload="metadata"
                    className="w-full h-full"
                    poster={undefined}
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-semibold text-[#333] text-[14px]">{file.title}</p>
                  {file.description && (
                    <p className="text-[12px] text-[#999] mt-0.5 line-clamp-2">{file.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {file.brands.map(br => (
                      <span key={br} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${BRAND_COLORS[br] ?? "bg-gray-100 text-gray-500"}`}>
                        {BRAND_LABELS[br] ?? br}
                      </span>
                    ))}
                    {file.fileSize ? (
                      <span className="text-[11px] text-[#bbb]">{formatSize(file.fileSize)}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Sonstiges ─── */}
      {other.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-white/10 text-white/60">
              Weitere Dateien
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {other.map(file => (
              <div key={file.id} className="bg-white rounded-xl p-4 flex flex-col gap-3">
                <div className="w-full h-24 rounded-lg bg-gray-50 flex items-center justify-center">
                  <span className="text-3xl">📁</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#333] text-[13px] truncate">{file.title}</p>
                  {file.description && <p className="text-[12px] text-[#999] mt-0.5">{file.description}</p>}
                </div>
                <a
                  href={`/api/download?url=${encodeURIComponent(file.fileUrl)}&filename=${encodeURIComponent(file.title || file.fileName)}`}
                  className="flex items-center justify-center gap-2 bg-[#30A2F1] hover:bg-[#1a8fd8] text-white text-[12px] font-semibold py-2 rounded-lg transition-colors"
                >
                  <Download size={13} />
                  Herunterladen
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
