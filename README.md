# Kanban Board

Ein Kanban-Board mit vier Lanes (**Do**, **Doing**, **Done**, **Archiv**), gebaut mit SvelteKit 3, Svelte 5 und Tailwind CSS 4. Die App ist als PWA installierbar und funktioniert komplett offline.

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






