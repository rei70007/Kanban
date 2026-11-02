# Kanban Board

Ein Kanban-Board mit vier Lanes (**Do**, **Doing**, **Done**, **Archiv**), gebaut mit SvelteKit 3, Svelte 5 und Tailwind CSS 4. Die App ist als PWA installierbar und funktioniert komplett offline.

**Live:** https://GITHUB-NAME.github.io/REPO-NAME/

## Funktionen

- Issues anlegen über ein natives HTML-`<dialog>`
- Issues per Drag & Drop zwischen den Lanes verschieben (native HTML5 Drag-and-Drop-API, keine Library)
- Jedes Issue hat Titel, Beschreibung, Erstellungsdatum, Fälligkeitsdatum, Story Points und Priorität
- Speicherung aller Issues (inkl. Lane) im `localStorage`
- Summe der Story Points pro Lane
- Visuelle Warnung bei überfälligen Issues (roter Rahmen + Hinweis)
- Benachrichtigung (Notification API), wenn ein Issue auf Done gezogen wird
- Export eines Issues als Kalendertermin (`.ics`)
- Teilen eines Issues über die Web Share API (Fallback: Zwischenablage)
- Export aller Issues als CSV
- Datumsanzeige mit [date-fns](https://date-fns.org/) auf Deutsch („in 3 Tagen“, „Fr., 30. Okt. 2026“)
- PWA mit Service Worker: alle Dateien werden beim ersten Besuch gecacht

## Projektstruktur

```
src/
├── app.html                  HTML-Grundgerüst (Manifest, Icons)
├── app.css                   Tailwind + Farben/Schriften (@theme)
├── service-worker.js         Offline-Cache für die PWA
├── lib/
│   ├── store.svelte.js       Zustand ($state) + localStorage + Lanes
│   ├── export.js             ICS, CSV, Web Share
│   ├── notify.js             Notifications
│   └── components/
│       ├── Header.svelte     Titel + Buttons
│       ├── Lane.svelte       Spalte, Drop-Ziel, Story-Point-Summe
│       ├── IssueCard.svelte  Karte, draggable, Überfällig-Warnung
│       └── IssueDialog.svelte  Formular im <dialog>
└── routes/
    ├── +layout.js            prerender = true, ssr = false
    ├── +layout.svelte        lädt app.css
    └── +page.svelte          setzt alles zusammen
static/
├── manifest.webmanifest      PWA-Manifest
└── icon.svg, icon-192.png, icon-512.png
```

## Starten

Voraussetzung: Node.js 22.17 oder neuer.

```bash
npm install
npm run dev       # Entwicklungsserver auf http://localhost:5173
npm run build     # Produktions-Build in den Ordner build/
npm run preview   # Build lokal testen (Service Worker läuft nur hier, nicht im dev-Modus)
```

## Deployment

Bei jedem Push auf `main` baut die GitHub Action in `.github/workflows/deploy.yml` die App und veröffentlicht sie auf GitHub Pages.

## Technik

| Bereich | Umsetzung |
| --- | --- |
| Framework | SvelteKit 3 mit `adapter-static` (reine statische Seite) |
| Reaktivität | Svelte 5 Runes: `$state`, `$derived`, `$props` |
| Styling | Tailwind CSS 4, Schriften Bricolage Grotesque und Atkinson Hyperlegible (lokal gebündelt) |
| Datum | date-fns mit deutscher Locale |
| Offline | Service Worker cacht alle Dateien aus `$app/manifest` |
