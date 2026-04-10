import { prisma } from "@/lib/prisma";
import { Download, Trash2, FileText, Video } from "lucide-react";
import BibliothekUploadForm from "@/components/admin/BibliothekUploadForm";
import { deleteMediaFile, updateMediaFile } from "@/app/actions/media";
import MediaTitleEdit from "@/components/admin/MediaTitleEdit";

const BRANDS = [
  { key: "mycleandent",  label: "mycleandent",  color: "bg-blue-50 text-blue-600" },
  { key: "cleanimplant", label: "CleanImplant",  color: "bg-teal-50 text-teal-600" },
];

function formatSize(bytes: number | null) {
  if (!bytes) return "–";
  if (bytes < 1024)      return `${bytes} B`;
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1024/1024).toFixed(1)} MB`;
}

export default async function AdminBibliothekPage() {
  const files = await prisma.mediaFile.findMany({
    where:   { category: "bibliothek" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#333]">Bibliothek</h1>
        <p className="text-[13px] text-[#999] mt-0.5">{files.length} Dateien · PDFs & Videos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upload */}
        <div className="lg:col-span-1">
          <BibliothekUploadForm />
        </div>

        {/* Dateiliste */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {files.length === 0 ? (
              <div className="py-16 text-center text-[#999] text-[14px]">
                Noch keine Dateien hochgeladen.
              </div>
            ) : (
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Datei</th>
                    <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Typ</th>
                    <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Marke</th>
                    <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Größe</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {files.map(file => {
                    const isPdf   = file.fileType === "application/pdf" || file.fileName.endsWith(".pdf");
                    const isVideo = file.fileType.startsWith("video/");
                    return (
                      <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded flex items-center justify-center flex-shrink-0 ${isPdf ? "bg-red-50" : isVideo ? "bg-blue-50" : "bg-gray-100"}`}>
                              {isPdf   ? <FileText size={16} className="text-red-400" /> :
                               isVideo ? <Video    size={16} className="text-blue-400" /> :
                                         <span className="text-base">📁</span>}
                            </div>
                            <div>
                              <MediaTitleEdit
                                id={file.id}
                                title={file.title}
                                description={file.description}
                                category="bibliothek"
                                brands={file.brands}
                                downloadUrl={file.downloadUrl}
                              />
                              <p className="text-[11px] text-[#999] truncate max-w-[220px]">{file.fileName}</p>
                              {file.description && (
                                <p className="text-[12px] text-[#666] mt-0.5">{file.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                            isPdf   ? "bg-red-50 text-red-500" :
                            isVideo ? "bg-blue-50 text-blue-500" :
                                      "bg-gray-100 text-gray-500"
                          }`}>
                            {isPdf ? "PDF" : isVideo ? "Video" : "Datei"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {BRANDS.map(b => (
                              <form key={b.key} action={async () => {
                                "use server";
                                const current  = file.brands;
                                const has      = current.includes(b.key);
                                const newBrands = has ? current.filter(x => x !== b.key) : [...current, b.key];
                                const fd = new FormData();
                                fd.set("title", file.title);
                                if (file.description) fd.set("description", file.description);
                                fd.set("category", "bibliothek");
                                newBrands.forEach(br => fd.append("brands", br));
                                await updateMediaFile(file.id, fd);
                              }}>
                                <button
                                  type="submit"
                                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-colors ${
                                    file.brands.includes(b.key)
                                      ? b.color + " border-transparent"
                                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                                  }`}
                                >
                                  {b.label}
                                </button>
                              </form>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[#999]">{formatSize(file.fileSize)}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3 justify-end">
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#30A2F1] hover:text-[#1a8fd8] transition-colors"
                              title="Öffnen"
                            >
                              <Download size={15} />
                            </a>
                            <form action={deleteMediaFile.bind(null, file.id)}>
                              <button
                                type="submit"
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="Löschen"
                              >
                                <Trash2 size={15} />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
