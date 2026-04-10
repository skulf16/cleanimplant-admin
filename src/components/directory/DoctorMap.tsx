"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export type DocPin = {
  id: string;
  lat: number | null;
  lng: number | null;
  name: string;
  slug: string;
  citySlug: string;
};

type Props = {
  doctors: DocPin[];
  hoveredId: string | null;
};

function createPinEl(active: boolean): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = `
    width:${active ? 22 : 14}px;
    height:${active ? 22 : 14}px;
    background:${active ? "#e07360" : "#F4907B"};
    border-radius:50%;
    border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,${active ? 0.4 : 0.22});
    transition:width 0.2s,height 0.2s,background 0.2s,box-shadow 0.2s;
    cursor:pointer;
  `;
  return el;
}

// Inject bounce keyframes once
function ensureBounceStyle() {
  if (document.getElementById("pin-bounce-style")) return;
  const s = document.createElement("style");
  s.id = "pin-bounce-style";
  s.textContent = `
    @keyframes pin-bounce {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.7); }
      70%  { transform: scale(0.9); }
      100% { transform: scale(1.4); }
    }
  `;
  document.head.appendChild(s);
}

export default function DoctorMap({ doctors, hoveredId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Record<string, google.maps.marker.AdvancedMarkerElement>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const valid = doctors.filter((d) => d.lat != null && d.lng != null);

    // setOptions must only be called once globally
    if (!(window as Window & { __gmapsInitialized?: boolean }).__gmapsInitialized) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setOptions as any)({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
        version: "weekly",
      });
      (window as Window & { __gmapsInitialized?: boolean }).__gmapsInitialized = true;
    }

    (async () => {
      const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await importLibrary("marker") as google.maps.MarkerLibrary;

      ensureBounceStyle();

      const center =
        valid.length > 0
          ? {
              lat: valid.reduce((s, d) => s + d.lat!, 0) / valid.length,
              lng: valid.reduce((s, d) => s + d.lng!, 0) / valid.length,
            }
          : { lat: 51.1657, lng: 10.4515 };

      const map = new Map(containerRef.current!, {
        center,
        zoom: valid.length === 1 ? 13 : 7,
        mapId: "mycleandent-map",
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
      });

      mapRef.current = map;

      if (valid.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        valid.forEach((d) => bounds.extend({ lat: d.lat!, lng: d.lng! }));
        map.fitBounds(bounds, 60);
      }

      valid.forEach((doc) => {
        const pinEl = createPinEl(false);

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: doc.lat!, lng: doc.lng! },
          content: pinEl,
          title: doc.name,
        });

        marker.addListener("gmp-click", () => {
          window.location.href = `/zahnarzt/${doc.citySlug}/${doc.slug}`;
        });

        markersRef.current[doc.id] = marker;
      });
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current = null;
        markersRef.current = {};
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate pin on hover
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const active = id === hoveredId;
      const el = marker.content as HTMLElement;
      if (!el) return;

      el.style.width = active ? "22px" : "14px";
      el.style.height = active ? "22px" : "14px";
      el.style.background = active ? "#e07360" : "#F4907B";
      el.style.boxShadow = `0 2px 8px rgba(0,0,0,${active ? 0.4 : 0.22})`;

      if (active) {
        el.style.animation = "none";
        void el.offsetHeight;
        el.style.animation = "pin-bounce 0.35s ease forwards";
      } else {
        el.style.animation = "none";
      }
    });
  }, [hoveredId, doctors]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }}
    />
  );
}
