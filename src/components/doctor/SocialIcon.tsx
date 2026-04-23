// Inline-SVG-Icons für die sechs in der DB möglichen Social-Plattformen.
// Lucide React liefert keine Brand-Marks mehr (aus Markenrecht-Gründen),
// deshalb hier eine kleine, pflegbare SVG-Bibliothek.

type Props = {
  platform: string;
  size?: number;
  color?: string;
};

export default function SocialIcon({ platform, size = 18, color = "#00385E" }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  };

  switch (platform) {
    case "FACEBOOK":
      return (
        <svg {...common}>
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      );
    case "INSTAGRAM":
      return (
        <svg {...common} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
        </svg>
      );
    case "LINKEDIN":
      return (
        <svg {...common}>
          <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18.34H5.67V9.75h2.67v8.59Zm-1.34-9.77a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.34 9.77h-2.67v-4.18c0-1 -.02-2.29-1.39-2.29-1.4 0-1.61 1.09-1.61 2.22v4.25H9.99V9.75h2.56v1.17h.04c.36-.67 1.22-1.37 2.52-1.37 2.7 0 3.2 1.78 3.2 4.09v4.7Z" />
        </svg>
      );
    case "YOUTUBE":
      return (
        <svg {...common}>
          <path d="M23.5 7.4a3 3 0 0 0-2.12-2.12C19.6 4.8 12 4.8 12 4.8s-7.6 0-9.38.48A3 3 0 0 0 .5 7.4C.02 9.17.02 12 .02 12s0 2.83.48 4.6a3 3 0 0 0 2.12 2.12C4.4 19.2 12 19.2 12 19.2s7.6 0 9.38-.48A3 3 0 0 0 23.5 16.6c.48-1.77.48-4.6.48-4.6s0-2.83-.48-4.6ZM9.75 15.36V8.64L15.82 12l-6.07 3.36Z" />
        </svg>
      );
    case "TIKTOK":
      return (
        <svg {...common}>
          <path d="M19.5 7.3a6.5 6.5 0 0 1-4.2-1.55V15.6a5.4 5.4 0 1 1-5.4-5.4c.27 0 .53.02.78.06v2.7a2.7 2.7 0 1 0 1.92 2.6V2h2.7a4.5 4.5 0 0 0 4.2 4.5v.8Z" />
        </svg>
      );
    case "XING":
      return (
        <svg {...common}>
          <path d="M8.86 7.13H5.62c-.27 0-.47.21-.47.43 0 .07.03.14.07.22l1.98 3.42-3.09 5.45a.4.4 0 0 0-.06.22c0 .21.19.42.46.42h3.24c.32 0 .52-.24.65-.47l3.13-5.53-1.99-3.48c-.14-.24-.33-.68-.68-.68ZM20.13 2.5h-3.25c-.32 0-.5.24-.63.47l-6.52 11.54 4.14 7.55c.14.24.34.47.68.47h3.23c.27 0 .47-.21.47-.43a.42.42 0 0 0-.07-.22L14.1 14.5v-.02l6.46-11.43a.4.4 0 0 0 .06-.22c0-.21-.2-.43-.46-.43Z" />
        </svg>
      );
    default:
      return (
        <span style={{ fontSize: 11, fontWeight: 700, color }}>
          {platform.slice(0, 2)}
        </span>
      );
  }
}

export const SOCIAL_LABELS: Record<string, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  LINKEDIN: "LinkedIn",
  YOUTUBE: "YouTube",
  TIKTOK: "TikTok",
  XING: "Xing",
};
