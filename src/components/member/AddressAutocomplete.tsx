"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { MapPin, Search } from "lucide-react";

type InitialAddress = {
  street?: string | null;
  zip?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
};

type Props = {
  initial?: InitialAddress;
};

type ParsedAddress = {
  street: string;
  zip: string;
  city: string;
  region: string;
  country: string; // ISO-2, e.g. "DE" / "AT" / "CH" / "OTHER"
  lat: string;
  lng: string;
};

const SUPPORTED_COUNTRIES = new Set(["DE", "AT", "CH"]);

function initialToParsed(init?: InitialAddress): ParsedAddress {
  return {
    street:  init?.street  ?? "",
    zip:     init?.zip     ?? "",
    city:    init?.city    ?? "",
    region:  init?.region  ?? "",
    country: init?.country || "DE",
    lat:     init?.lat != null ? String(init.lat) : "",
    lng:     init?.lng != null ? String(init.lng) : "",
  };
}

function buildDisplay(a: ParsedAddress): string {
  const parts: string[] = [];
  if (a.street) parts.push(a.street);
  const cityPart = [a.zip, a.city].filter(Boolean).join(" ");
  if (cityPart) parts.push(cityPart);
  if (a.country && a.country !== "DE") parts.push(a.country);
  return parts.join(", ");
}

// Google places API types are loose; we use a lightweight local type
type PlaceComponent = { long_name: string; short_name: string; types: string[] };
type PlaceResult = {
  address_components?: PlaceComponent[];
  geometry?: { location?: { lat: () => number; lng: () => number } };
  formatted_address?: string;
};

function parsePlace(place: PlaceResult): ParsedAddress {
  const result: ParsedAddress = {
    street: "",
    zip: "",
    city: "",
    region: "",
    country: "OTHER",
    lat: "",
    lng: "",
  };

  let route = "";
  let streetNumber = "";

  for (const comp of place.address_components ?? []) {
    const t = comp.types;
    if (t.includes("route")) route = comp.long_name;
    else if (t.includes("street_number")) streetNumber = comp.long_name;
    else if (t.includes("postal_code")) result.zip = comp.long_name;
    else if (t.includes("locality")) result.city = comp.long_name;
    else if (!result.city && t.includes("postal_town")) result.city = comp.long_name;
    else if (t.includes("administrative_area_level_1")) result.region = comp.long_name;
    else if (t.includes("country")) {
      const code = comp.short_name.toUpperCase();
      result.country = SUPPORTED_COUNTRIES.has(code) ? code : "OTHER";
    }
  }

  // German-style: "Musterstraße 12"
  result.street = [route, streetNumber].filter(Boolean).join(" ");

  const loc = place.geometry?.location;
  if (loc) {
    result.lat = String(loc.lat());
    result.lng = String(loc.lng());
  }

  return result;
}

export default function AddressAutocomplete({ initial }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedAddress>(() => initialToParsed(initial));
  const [display, setDisplay] = useState<string>(() => buildDisplay(initialToParsed(initial)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const w = window as Window & { __gmapsInitialized?: boolean };
        if (!w.__gmapsInitialized) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (setOptions as any)({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
            version: "weekly",
          });
          w.__gmapsInitialized = true;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const places = (await importLibrary("places")) as any;
        if (cancelled || !inputRef.current) return;

        const autocomplete = new places.Autocomplete(inputRef.current, {
          fields: ["address_components", "geometry", "formatted_address"],
          types: ["address"],
          componentRestrictions: { country: ["de", "at", "ch"] },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace() as PlaceResult;
          if (!place.address_components) return;
          const p = parsePlace(place);
          setParsed(p);
          setDisplay(buildDisplay(p));
          if (inputRef.current) inputRef.current.value = buildDisplay(p);
        });

        setLoading(false);
      } catch (e) {
        console.error("Google Places failed to load:", e);
        if (!cancelled) {
          setError("Adresssuche konnte nicht geladen werden");
          setLoading(false);
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const hasParsed = Boolean(parsed.street || parsed.city || parsed.zip);

  return (
    <div>
      <label className="label">Adresse suchen *</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#999]">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#ddd] border-t-[#555] rounded-full animate-spin" />
          ) : (
            <Search size={16} />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          defaultValue={display}
          placeholder={loading ? "Lade Adresssuche…" : "Straße, Hausnummer, Stadt…"}
          className="input pl-9"
          disabled={loading}
          autoComplete="off"
        />
      </div>

      {error && (
        <p className="text-[12px] text-red-600 mt-1.5">{error}</p>
      )}

      {/* Parsed preview */}
      {hasParsed && !error && (
        <div className="mt-3 flex items-start gap-2 bg-[#f5f6f8] border border-[#e5e7eb] rounded-[4px] px-3 py-2">
          <MapPin size={14} className="text-[#30A2F1] mt-0.5 flex-shrink-0" />
          <div className="text-[12px] leading-relaxed text-[#555]">
            {parsed.street && <div><strong className="text-[#333]">{parsed.street}</strong></div>}
            <div>
              {[parsed.zip, parsed.city].filter(Boolean).join(" ")}
              {parsed.region && ` · ${parsed.region}`}
            </div>
            <div className="text-[11px] text-[#888] mt-0.5">
              {parsed.country === "DE" && "Deutschland"}
              {parsed.country === "AT" && "Österreich"}
              {parsed.country === "CH" && "Schweiz"}
              {parsed.country === "OTHER" && "Sonstiges"}
              {parsed.lat && parsed.lng && ` · ${Number(parsed.lat).toFixed(4)}, ${Number(parsed.lng).toFixed(4)}`}
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#999] mt-1.5">
        Beginnen Sie zu tippen und wählen Sie die passende Adresse aus den Vorschlägen. Alle Felder (Straße, PLZ, Stadt, Koordinaten) werden automatisch ausgefüllt.
      </p>

      {/* Hidden inputs for FormData submission */}
      <input type="hidden" name="street"  value={parsed.street} />
      <input type="hidden" name="zip"     value={parsed.zip} />
      <input type="hidden" name="city"    value={parsed.city} />
      <input type="hidden" name="region"  value={parsed.region} />
      <input type="hidden" name="country" value={parsed.country} />
      <input type="hidden" name="lat"     value={parsed.lat} />
      <input type="hidden" name="lng"     value={parsed.lng} />
    </div>
  );
}
