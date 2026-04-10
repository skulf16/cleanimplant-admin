import { prisma } from "@/lib/prisma";
import { Download, Trash2 } from "lucide-react";
import MediaUploadForm from "@/components/admin/MediaUploadForm";
import { deleteMediaFile, updateMediaFile } from "@/app/actions/media";
import MediaTitleEdit from "@/components/admin/MediaTitleEdit";

const BRANDS = [
  { key: "mycleandent",  label: "mycleandent",  color: "bg-blue-50 text-blue-600" },
  { key: "cleanimplant", label: "CleanImplant",  color: "bg-teal-50 text-teal-600" },
];

const CATEGORIES = [
  { key: "logos",      label: "Logos" },
  { key: "print",      label: "Print" },
  { key: "social",     label: "Social Media" },
  { key: "digital",    label: "Digitaler Content" },
  { key: "bibliothek", label: "Bibliothek" },
];

const CATEGORY_COLORS: Record<string, string> = {
  logos:      "bg-purple-50 text-purple-600",
  print:      "bg-orange-50 text-orange-600",
  social:     "bg-pink-50 text-pink-600",
  digital:    "bg-cyan-50 text-cyan-600",
  bibliothek: "bg-amber-50 text-amber-600",
};

function formatSize(bytes: number | null) {
  if (!bytes) return "–";
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1024/1024).toFixed(1)} MB`;
}

function fileIcon(type: string) {
  if (type.startsWith("image/")) return "🖼";
  if (type === "application/pdf") return "📄";
  if (type.startsWith("video/"))  return "🎬";
  if (type.includes("zip") || type.includes("compressed")) return "📦";
  return "📁";
}

export default async function LogosMediaPage() {
  const files = await prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#333]">Logos & Media</h1>
        <p className="text-[13px] text-[#999] mt-0.5">{files.length} Dateien</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upload-Formular */}
        <div className="lg:col-span-1">
          <MediaUploadForm />
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
                    <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Kategorie</th>
                    <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Marke</th>
                    <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide">Größe</th>
                    <th className="px-5 py-3 text-[12px] font-semibold text-[#666] uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {files.map(file => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-3">
                          <span className="text-lg flex-shrink-0">{fileIcon(file.fileType)}</span>
                          <div>
                            <MediaTitleEdit
                              id={file.id}
                              title={file.title}
                              description={file.description}
                              category={file.category}
                              brands={file.brands}
                              downloadUrl={file.downloadUrl}
                            />
                            <p className="text-[11px] text-[#999] truncate max-w-[200px]">{file.fileName}</p>
                            {file.description && (
                              <p className="text-[12px] text-[#666] mt-0.5">{file.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Kategorie-Toggle */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          {CATEGORIES.map(cat => (
                            <form key={cat.key} action={async (fd: FormData) => {
                              "use server";
                              const newFd = new FormData();
                              newFd.set("title", file.title);
                              if (file.description) newFd.set("description", file.description);
                              newFd.set("category", cat.key);
                              file.brands.forEach(br => newFd.append("brands", br));
                              await updateMediaFile(file.id, newFd);
                            }}>
                              <button
                                type="submit"
                                className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                                  file.category === cat.key
                                    ? (CATEGORY_COLORS[cat.key] ?? "bg-gray-100 text-gray-600") + " border-transparent"
                                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                                }`}
                              >
                                {cat.label}
                              </button>
                            </form>
                          ))}
                        </div>
                      </td>

                      {/* Marken-Toggle */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {BRANDS.map(b => (
                            <form key={b.key} action={async (fd: FormData) => {
                              "use server";
                              const current = file.brands;
                              const has = current.includes(b.key);
                              const newBrands = has
                                ? current.filter(x => x !== b.key)
                                : [...current, b.key];
                              const newFd = new FormData();
                              newFd.set("title", file.title);
                              if (file.description) newFd.set("description", file.description);
                              newFd.set("category", file.category);
                              newBrands.forEach(br => newFd.append("brands", br));
                              await updateMediaFile(file.id, newFd);
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
                            href={file.downloadUrl || file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#30A2F1] hover:text-[#1a8fd8] transition-colors"
                            title={file.downloadUrl ? "Externer Download-Link" : "Download"}
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
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
