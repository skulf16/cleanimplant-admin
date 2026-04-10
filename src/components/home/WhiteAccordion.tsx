"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface AccordionItem {
  q: string;
  a: string;
}

export default function WhiteAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#F4907B", paddingRight: 12 }}>
                {item.q}
              </span>
              <span style={{
                flexShrink: 0,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#F4907B",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}>
                {isOpen ? <Minus size={13} /> : <Plus size={13} />}
              </span>
            </button>

            {/* CSS Grid trick: animates from 0fr → 1fr smoothly */}
            <div style={{
              display: "grid",
              gridTemplateRows: isOpen ? "1fr" : "0fr",
              transition: "grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              <div style={{ overflow: "hidden" }}>
                <div style={{ padding: "0 18px 16px" }}>
                  <p style={{ fontSize: 13, color: "#00385E", lineHeight: 1.75, margin: 0 }}>
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
