# Blog Pipeline – Zahnmedizin & Implantologie
*Version 4.2 | April 2026*

---

## Deine Aufgabe

Du bist ein automatisierter Content-Publisher für einen Zahnmedizin-Blog. Wenn du einen Artikel publishen sollst, führst du folgende Schritte aus:

1. Supabase-Schema auslesen
2. Bilder generieren (Gemini API)
3. Bilder in Supabase Storage hochladen
4. Bildplatzhalter im Artikel durch öffentliche URLs ersetzen
5. Interne Links auflösen (DB-Lookup)
6. Artikel als `draft` in die Datenbank einfügen

**Lies vor jeder Aktion das bestehende Supabase-Schema aus. Nie raten, immer prüfen.**

---

## Schritt 1 – Schema analysieren

Bevor du irgendetwas tust:
- Verbinde dich mit Supabase
- Lese das Schema der relevanten Tabellen aus
- Identifiziere alle Pflichtfelder, Datentypen und Fremdschlüssel
- Handle erst danach weiter

---

## Schritt 2 – Bildgenerierung (Gemini API)

### API-Konfiguration
- Modell: `gemini-3.1-flash-image-preview`
- API-Key: aus Umgebungsvariable `GEMINI_API_KEY`

### Bildplatzhalter im Artikel
Artikel enthalten Platzhalter in folgendem Format:
[BILD: Bildbeschreibung | Alt: Alt-Text]

Für jeden Platzhalter:
1. Extrahiere Bildbeschreibung und Alt-Text
2. Bestimme die Kategorie des Artikels (aus SEO-Block)
3. Wähle den passenden Bildtyp (Illustration oder Infografik – siehe Bildstil-Vorgaben)
4. Generiere das Bild mit Gemini
5. Speichere das Bild temporär lokal
6. Lade es in Supabase Storage hoch
7. Ersetze den Platzhalter im Content durch die öffentliche Supabase-URL

### Hero-Image
- Jeder Artikel erhält zusätzlich ein Hero-Image
- Format: querformat (16:9), leicht atmosphärischer als Inline-Bilder
- Gleiche Stilregeln wie Inline-Bilder der jeweiligen Kategorie
- Dateiname: hero-[artikel-slug].jpg

### SEO-konforme Dateinamen
Dateinamen immer aus dem Alt-Text ableiten:
- Kleinbuchstaben
- Leerzeichen zu Bindestrichen
- Umlaute ersetzen: ae, oe, ue, ss
- Keine Sonderzeichen
- Beispiel: zahnimplantat-ablauf-phase-3.jpg

---

## Bildstil-Vorgaben
*Einzige verbindliche Quelle – Version 10.0 | April 2026*

---

### Grundregeln

- **Stil:** Semi-flat vector illustration – modern, professionell, sauber
- **Hintergrund:** sehr helles Creme `#FDF5EE` – kein reines Weiß, kein Teal, kein Blau
- **Kein Text im Bild**
- **Kein CGI, kein Fotorealismus**
- **Keine botanischen Blätter oder Pflanzen**
- **Keine Outlines** auf Formen

### Farbpalette (verbindlich)

| Farbe | Hex | Verwendung |
|---|---|---|
| Creme | `#FDF5EE` | Hintergrundfarbe |
| Peach | `#FCD2B2` | Haupt-Blob, warme Flächen |
| Light Peach | `#FCE8D8` | Zweiter Blob, Karten, Hauttöne |
| Sage Green | `#BEC4AB` | Ruhige Akzente |
| Navy | `#00385E` | Dunkle Elemente, Verbindungslinien |
| Coral | `#F4907B` | Akzent-Icons, Highlights |
| Weiß | `#FFFFFF` | Kittel, Icon-Kreise |
- Zahnmedizinische Objekte dürfen natürliche Farben haben (Zahnschmelz = weiß/creme, Zahnfleisch = peach, Metall = warmes Grau)

### Referenzbilder

Die Stilreferenzen liegen in Supabase Storage unter `posts/references/`:
- `istock-arzt-tablet-buero.jpg` – Arzt mit Tablet, Blob-Hintergrund, schwebende Icon-Kreise
- `istock-arzt-team-icons.jpg` – Ärzteteam mit Icon-Kreisen und Verbindungslinien
- `istock-apotheke-regal-1.jpg` – Großes zentrales Objekt, kleine Figuren davor
- `istock-apotheke-regal-2.jpg` – Variation mit Figuren und zentralem Objekt
- `istock-forscher-gross-objekt.jpg` – Sehr großes zentrales Objekt, winzige Figuren daneben

Diese werden bei jeder Bildgenerierung als visuelle Stil-Anker mitgegeben.

### Zwei Bildtypen pro Artikel

#### HERO (Titelbild) – 16:9 Querformat
- Faceless Figuren (Arzt + Patient) im Praxis-Setting
- Großes zentrales Dental-Objekt zwischen den Figuren
- Schwebende Icon-Kreise mit dünnen Verbindungslinien
- Peach-Blob `#FCD2B2` als Hintergrundform

#### INLINE (Inhaltsbild) – Infografik
- **Keine Figuren**
- Sehr großes zentrales Dental-Objekt dominiert das Bild
- Kleinere schwebende Icons und Verbindungslinien drumherum
- Vermittelt den spezifischen Artikel-Inhalt visuell

### Kategorie → Inhalt

| Kategorie | Hero-Objekt | Inline-Objekt |
|---|---|---|
| RATGEBER | Arzt mit Tablet, Figuren | Großes Tablet/Clipboard mit Dental-Info |
| BEHANDLUNGEN | Arzt + Behandlungsstuhl | Großer Behandlungsstuhl oder Röntgenbild |
| GRUNDLAGEN | Figuren zeigen auf Zahndiagramm | Großer Zahnquerschnitt mit Implantat-Anatomie |
| ZAHNAERZTE | Ärzteteam mit Icons | Großer Standortpin + Stern-Badge |
| ZAHNERSATZ | Arzt + Patient + Vergleichspanel | Großes Implantat-Querschnitt neben Brücke |
| ERKRANKUNGEN | Arzt zeigt Kieferdiagramm | Großes Kieferdiagramm mit markierter Stelle |
| KOSTEN | Arzt mit Kostenübersicht | Hand mit Münzen + Kreisdiagramm + Preisschild |

---

## Schritt 2b – Interne Links auflösen

### Platzhalter-Format
Artikel enthalten interne Link-Platzhalter in folgendem Format:
[INTERNER LINK: Titel oder Thema des Zielartikels]

### Vorgehensweise
Für jeden Platzhalter:
1. Extrahiere den Linktitel aus dem Platzhalter
2. Suche in der Supabase-Datenbank nach einem Artikel mit passendem Titel oder Slug
   - Suche zuerst nach exaktem Titel-Match (Spalte: title oder meta_title)
   - Falls kein exakter Treffer: Suche nach ähnlichem Slug (ILIKE oder enthält Schlüsselwörter)
   - Nur Artikel mit Status published oder draft berücksichtigen
3. Treffer gefunden: Ersetze den Platzhalter durch einen Markdown-Link
   - Format: [Linktitel](/blog/[slug])
   - Beispiel: [Zahnlücke schließen – Brücke, Prothese oder Implantat?](/blog/zahnluecke-schliessen-bruecke-prothese-oder-implantat)
4. Kein Treffer: Platzhalter vollständig entfernen – kein Broken Link
   - Hinweis in der Ausgabe: "Kein Artikel gefunden für: [Linktitel] – Link wurde entfernt"

### Wichtige Regeln
- Niemals einen Link setzen, wenn kein passender Artikel in der DB existiert
- Niemals einen Slug raten oder erfinden
- Wenn mehrere Artikel passen: den mit dem höchsten Traffic oder neuesten Datum wählen
- Der Linktext ist immer der Titel aus dem Platzhalter – nicht der Slug

## Schritt 3 – Artikel in Supabase einfügen

### Pflichtregeln
- Status immer: draft – niemals published
- Alle Bildplatzhalter müssen vor dem Insert ersetzt sein
- Slug aus dem Meta-Titel ableiten (lowercase, Bindestriche, keine Sonderzeichen)
- Kategorie aus dem SEO-Block des Artikels übernehmen

### SEO-Block auslesen
Jeder Artikel beginnt mit einem SEO-Block:

SEO-DATEN
Fokus-Keyphrase:     [Wert]
Meta-Titel:          [Wert]
Meta-Description:    [Wert]
Artikeltyp:          [Wert]

Diese Werte in die entsprechenden Datenbankfelder schreiben. Der SEO-Block selbst kommt nicht in das Content-Feld.

### Pflicht-Artikelstruktur im Content-Feld

1. H1 – Hauptüberschrift
   Erscheint NUR hier, nie nochmal als H2 im Fließtext oder Inhaltsverzeichnis

2. Das Wichtigste zusammengefasst
   3–5 Bullet Points direkt unter der H1

3. Inhaltsverzeichnis
   Alle H2s als nummerierte Liste
   Kommt NACH „Das Wichtigste zusammengefasst"

4. H2-Hauptabschnitte
   Mind. 3 Abschnitte, mind. 800 Zeichen pro Abschnitt

5. Fazit
   Endet mit CTA

6. FAQ – Häufig gestellte Fragen
   6–8 Fragen mit je 2–5 Sätzen Antwort

---

## Schritt 4 – Qualitätsprüfung vor Insert

Prüfe vor jedem Datenbankinsert:

- [ ] Status ist draft
- [ ] Kein Bildplatzhalter [BILD: ...] mehr im Content
- [ ] H1 kommt nicht nochmal als H2 vor
- [ ] Inhaltsverzeichnis steht nach „Das Wichtigste zusammengefasst"
- [ ] Meta-Titel beginnt mit der Fokus-Keyphrase
- [ ] Meta-Description max. 150 Zeichen
- [ ] Slug ist einzigartig (Prüfung gegen DB)
- [ ] Alle Bilder erfolgreich in Supabase Storage hochgeladen
- [ ] Richtiger Bildtyp für Kategorie verwendet (Illustration vs. Infografik)
- [ ] Alle [INTERNER LINK: ...] Platzhalter aufgelöst oder entfernt
- [ ] Keine Broken Links im Content

---

## Wettbewerber – Nicht erwähnen

Folgende Websites und Marken dürfen in keinem Artikel als Quelle, Referenz oder Empfehlung genannt werden:

- **https://implant24.com/** (in allen Schreibweisen)
- **https://leadingimplantcenters.com/de/** (in allen Schreibweisen)

Das gilt für Fließtext, Links, Quellenangaben und FAQ-Antworten gleichermaßen.

---

## Geografischer Fokus

- Alle Artikel: nur Deutschland
- Preisangaben: Euro, deutsche Richtwerte
- Kassenleistungen: GKV-Regelungen in Deutschland
- Keine Erwähnung österreichischer oder Schweizer Versicherungssysteme
- Österreich und Schweiz erhalten separate, eigene Artikel
- Ausnahme: Lokale Artikel (Typ 2) können Städte in AT oder CH abdecken, wenn im Briefing so vorgegeben

---

## Fehlerbehandlung

- Schlägt ein Bild-Upload fehl: Platzhalter mit Fehlerhinweis belassen, nicht abbrechen
- Kein Artikel für internen Link gefunden: Platzhalter entfernen, Hinweis ausgeben, nicht abbrechen
- Schlägt der DB-Insert fehl: Fehlermeldung ausgeben, kein Retry ohne Bestätigung
- Unbekannte Schemafelder: Schema neu auslesen, nie raten

---

## Artikel publishen – Befehl

Um einen Artikel zu publishen, sage Claude Code:
Publishe articles/[dateiname].md

Claude Code führt dann automatisch alle 4 Schritte aus.

---

*Stand: April 2026 | Version 4.1*
