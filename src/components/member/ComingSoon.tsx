import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

export default function ComingSoon({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div
          className="mx-auto mb-5 flex items-center justify-center w-16 h-16 rounded-full"
          style={{ backgroundColor: "rgba(42, 100, 150, 0.3)" }}
        >
          <Icon size={28} style={{ color: "#4a9ebe" }} />
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "#ffffff" }}>{title}</h2>
        <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {description ?? "Dieser Bereich wird in Kürze verfügbar sein."}
        </p>
      </div>
    </div>
  );
}
