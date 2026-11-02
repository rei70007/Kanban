// Export-Funktionen: ICS (Kalender), CSV (Tabelle) und Teilen (Web Share API)
import { format, addDays, parseISO } from 'date-fns';
import { LANES } from './store.svelte.js';

const PRIORITY_LABEL = { low: 'Niedrig', medium: 'Mittel', high: 'Hoch' };

// Hilfsfunktion: Text als Datei herunterladen
function download(filename, content, type) {
	const blob = new Blob([content], { type }); // Datei im Speicher erzeugen
	const url = URL.createObjectURL(blob); // temporäre URL dafür
	const a = document.createElement('a'); // unsichtbarer Link
	a.href = url;
	a.download = filename;
	a.click(); // Download starten
	URL.revokeObjectURL(url); // Speicher wieder freigeben
}

// Dateiname ohne Sonderzeichen, z. B. "Login bauen!" -> "login-bauen"
function slug(text) {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'issue';
}

// ---------- ICS ----------

// In ICS müssen \ ; , und Zeilenumbrüche escaped werden
function icsEscape(text = '') {
	return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// Ein Issue als ganztägiger Kalendertermin am Due-Date
export function exportIcs(issue) {
	const due = parseISO(issue.dueDate);
	// DTSTAMP = jetzt in UTC, Format 20261102T083000Z
	const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

	const lines = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Kanban Board//DE',
		'BEGIN:VEVENT',
		`UID:${issue.id}@kanban`,
		`DTSTAMP:${stamp}`,
		`DTSTART;VALUE=DATE:${format(due, 'yyyyMMdd')}`, // Startdatum
		`DTEND;VALUE=DATE:${format(addDays(due, 1), 'yyyyMMdd')}`, // Ende = Tag danach (ganztägig)
		`SUMMARY:${icsEscape(issue.title)}`,
		`DESCRIPTION:${icsEscape(
			`${issue.description}\nStory Points: ${issue.points}\nPriorität: ${PRIORITY_LABEL[issue.priority]}`
		)}`,
		'END:VEVENT',
		'END:VCALENDAR'
	];
	// ICS verlangt Windows-Zeilenumbrüche (\r\n)
	download(`${slug(issue.title)}.ics`, lines.join('\r\n'), 'text/calendar');
}

// ---------- CSV ----------

// Jeden Wert in Anführungszeichen setzen, innere " verdoppeln
function csvCell(value) {
	return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

// Alle Issues als CSV. Trennzeichen ";" weil deutsches Excel das erwartet.
export function exportCsv(issues) {
	const header = ['Titel', 'Beschreibung', 'Lane', 'Erstellt', 'Fällig', 'Story Points', 'Priorität'];
	const rows = issues.map((i) => [
		i.title,
		i.description,
		LANES.find((l) => l.id === i.lane)?.title,
		format(parseISO(i.createdAt), 'dd.MM.yyyy HH:mm'),
		format(parseISO(i.dueDate), 'dd.MM.yyyy'),
		i.points,
		PRIORITY_LABEL[i.priority]
	]);
	const csv = [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n');
	// \uFEFF (BOM) sorgt dafür, dass Excel Umlaute richtig anzeigt
	download('kanban-export.csv', '\uFEFF' + csv, 'text/csv;charset=utf-8');
}

// ---------- Web Share API ----------

export async function shareIssue(issue) {
	const text =
		`${issue.title}\n${issue.description}\n` +
		`Fällig: ${format(parseISO(issue.dueDate), 'dd.MM.yyyy')}\nStory Points: ${issue.points}`;

	// navigator.share gibt es nur in manchen Browsern (z. B. Handy, Safari, Edge)
	if (navigator.share) {
		try {
			await navigator.share({ title: issue.title, text });
		} catch {
			// Nutzer hat das Teilen abgebrochen -> nichts tun
		}
	} else {
		// Fallback: in die Zwischenablage kopieren
		await navigator.clipboard.writeText(text);
		alert('Teilen wird hier nicht unterstützt. Der Text wurde in die Zwischenablage kopiert.');
	}
}
