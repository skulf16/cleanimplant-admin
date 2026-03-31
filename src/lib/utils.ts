import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildDoctorName(
  title: string | null,
  firstName: string,
  lastName: string,
  suffix: string | null
): string {
  const parts = [title, firstName, lastName, suffix].filter(Boolean);
  return parts.join(" ");
}

export function getDomainLabel(hostname: string): "DE" | "COM" {
  if (hostname.endsWith(".de") || hostname.includes("localhost")) return "DE";
  return "COM";
}
