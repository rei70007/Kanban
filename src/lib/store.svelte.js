// Zentraler Zustand des Boards.
// Die Endung ".svelte.js" erlaubt Svelte-Runes ($state) auch außerhalb von Komponenten.
import { browser } from '$app/env';

// Schlüssel, unter dem alles im localStorage liegt
const STORAGE_KEY = 'kanban-issues';

// Die 4 Lanes. "id" wird im Issue gespeichert, "title" wird angezeigt.
export const LANES = [
	{ id: 'todo', title: 'Do' },
	{ id: 'doing', title: 'Doing' },
	{ id: 'done', title: 'Done' },
	{ id: 'archive', title: 'Archiv' }
];

// Issues aus dem localStorage laden (oder leere Liste, wenn noch nichts da ist)
function load() {
	if (!browser) return [];
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
	} catch {
		return []; // kaputte Daten -> neu anfangen
	}
}

// $state macht das Objekt "reaktiv": Ändert sich board.issues,
// aktualisieren sich alle Komponenten, die es verwenden, automatisch.
export const board = $state({ issues: load() });

// Alle Issues (inkl. ihrer Lane) als JSON-Text speichern
function save() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(board.issues));
}

// Neues Issue anlegen. data kommt aus dem Formular im Dialog.
export function addIssue(data) {
	board.issues.push({
		id: crypto.randomUUID(), // eindeutige ID
		title: data.title,
		description: data.description,
		createdAt: new Date().toISOString(), // Erstellungsdatum = jetzt
		dueDate: data.dueDate, // Format "2026-11-20"
		points: Number(data.points),
		priority: data.priority, // 'low' | 'medium' | 'high'
		lane: 'todo' // neue Issues starten immer in "Do"
	});
	save();
}

// Issue in eine andere Lane verschieben (nach Drag & Drop).
// Gibt das Issue zurück, damit man z. B. eine Notification zeigen kann.
export function moveIssue(id, lane) {
	const issue = board.issues.find((i) => i.id === id);
	if (!issue || issue.lane === lane) return null;
	issue.lane = lane;
	save();
	return issue;
}
