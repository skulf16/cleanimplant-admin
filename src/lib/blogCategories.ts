export const BLOG_CATEGORIES = [
  { key: "GRUNDLAGEN",    label: "Grundlagen & Verfahren",  slug: "grundlagen-verfahren",  visible: true  },
  { key: "ZAHNERSATZ",    label: "Zahnersatz & Prothetik",  slug: "zahnersatz-prothetik",  visible: true  },
  { key: "ERKRANKUNGEN",  label: "Erkrankungen & Symptome", slug: "erkrankungen-symptome", visible: true  },
  { key: "BEHANDLUNGEN",  label: "Behandlungen & Eingriffe", slug: "behandlungen-eingriffe", visible: true  },
  { key: "KOSTEN",        label: "Kosten & Versicherung",   slug: "kosten-versicherung",   visible: true  },
  { key: "RATGEBER",      label: "Ratgeber",                slug: "ratgeber",              visible: true  },
  { key: "ZAHNAERZTE",    label: "Zahnärzte",               slug: "zahnaerzte",            visible: false },
] as const;

export type BlogCategoryKey = typeof BLOG_CATEGORIES[number]["key"];

export const CATEGORY_META: Record<string, { title: string; description: string }> = {
  GRUNDLAGEN: {
    title: "Grundlagen & Verfahren – mycleandent",
    description: "Alles Wissenswerte zu Zahnimplantaten: Grundlagen, Verfahren und wie die Behandlung abläuft.",
  },
  ZAHNERSATZ: {
    title: "Zahnersatz & Prothetik – mycleandent",
    description: "Informationen zu Zahnersatz, Kronen, Brücken und prothetischen Versorgungen nach der Implantation.",
  },
  ERKRANKUNGEN: {
    title: "Erkrankungen & Symptome – mycleandent",
    description: "Übersicht häufiger Zahnerkrankungen, Symptome und wie diese mit modernen Methoden behandelt werden.",
  },
  BEHANDLUNGEN: {
    title: "Behandlungen & Eingriffe – mycleandent",
    description: "Detaillierte Informationen zu zahnärztlichen Behandlungen, Eingriffen und chirurgischen Verfahren.",
  },
  KOSTEN: {
    title: "Kosten & Versicherung – mycleandent",
    description: "Kosten für Zahnimplantate, Kostenübernahme durch Krankenkassen und Finanzierungsmöglichkeiten im Überblick.",
  },
  RATGEBER: {
    title: "Ratgeber – mycleandent",
    description: "Praktische Tipps und Ratgeber rund um Zahngesundheit, Implantate und die Behandlungsvorbereitung.",
  },
  ZAHNAERZTE: {
    title: "Zahnärzte – mycleandent",
    description: "Informationen und Ressourcen speziell für Zahnärzte und Zahnarztpraxen.",
  },
};
