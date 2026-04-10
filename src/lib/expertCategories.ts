import { ExpertCategory } from "@/generated/prisma/client";

export const EXPERT_CATEGORIES: { key: ExpertCategory; label: string }[] = [
  { key: "KI_IT",                label: "KI & IT"                  },
  { key: "ONLINE_MARKETING",     label: "Online-Marketing"         },
  { key: "VIDEO_FOTO",           label: "Video & Foto"             },
  { key: "COACHING_CONSULTING",  label: "Coaching & Consulting"    },
  { key: "PERSONAL_FUEHRUNG",    label: "Personal & Führung"       },
  { key: "PRAEVENTION",          label: "Prävention"               },
];

export const EXPERT_CATEGORY_LABEL: Record<ExpertCategory, string> = Object.fromEntries(
  EXPERT_CATEGORIES.map(c => [c.key, c.label])
) as Record<ExpertCategory, string>;
