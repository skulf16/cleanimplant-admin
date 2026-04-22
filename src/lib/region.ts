// Zentrale Utility für Region-Namen und Slugs.
//
// Hintergrund: In der DB sind manche Regionen aus Import-Gründen auf Englisch
// gespeichert (z. B. "Upper Austria"). Diese Datei übersetzt sie in die
// deutschen Bezeichnungen, die wir auf der Seite anzeigen – und leitet davon
// die URL-Slugs ab.
//
// Neue Übersetzungen: einfach im `REGION_NAME_MAP` ergänzen.

const REGION_NAME_MAP: Record<string, string> = {
  // Österreich
  "Upper Austria":   "Oberösterreich",
  "Lower Austria":   "Niederösterreich",
  "Styria":          "Steiermark",
  "Carinthia":       "Kärnten",
  "Tyrol":           "Tirol",
  "Vorarlberg":      "Vorarlberg",
  "Salzburg":        "Salzburg",
  "Burgenland":      "Burgenland",
  "Vienna":          "Wien",

  // Deutschland
  "Bavaria":         "Bayern",
  "Baden-Wurttemberg": "Baden-Württemberg",
  "Baden-Württemberg": "Baden-Württemberg",
  "Hesse":           "Hessen",
  "Lower Saxony":    "Niedersachsen",
  "North Rhine-Westphalia": "Nordrhein-Westfalen",
  "Rhineland-Palatinate": "Rheinland-Pfalz",
  "Saxony":          "Sachsen",
  "Saxony-Anhalt":   "Sachsen-Anhalt",
  "Schleswig-Holstein": "Schleswig-Holstein",
  "Thuringia":       "Thüringen",
  "Mecklenburg-Vorpommern": "Mecklenburg-Vorpommern",

  // Schweiz
  "Zurich":          "Zürich",
  "Geneva":          "Genf",
  "Berne":           "Bern",
  "St. Gallen":      "Sankt Gallen",
};

/**
 * Wandelt den rohen DB-Regionsnamen in den Anzeigenamen um.
 * Ist keine Übersetzung hinterlegt, wird der Wert unverändert zurückgegeben.
 */
export function normalizeRegionName(region: string): string {
  return REGION_NAME_MAP[region] ?? region;
}

/**
 * Erzeugt aus einem DB-Regionsnamen den URL-Slug.
 *
 * Beispiele:
 *   "Upper Austria" → "oberoesterreich"
 *   "Baden-Württemberg" → "baden-wuerttemberg"
 *   "Bayern" → "bayern"
 */
export function slugifyRegion(region: string): string {
  return normalizeRegionName(region)
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
