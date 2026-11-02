<script>
	// Eine Karte = ein Issue. Kann per Drag & Drop gezogen werden.
	import { format, formatDistanceToNow, parseISO, isPast, endOfDay } from 'date-fns';
	import { de } from 'date-fns/locale'; // deutsche Texte, z. B. "vor 3 Tagen"
	import { exportIcs, shareIssue } from '#lib/export.js';

	// Props: das Issue-Objekt kommt von der Lane
	let { issue } = $props();

	// true, während die Karte gezogen wird (für halbe Transparenz)
	let dragging = $state(false);

	// Datum-Objekte aus den gespeicherten Texten erzeugen
	let due = $derived(parseISO(issue.dueDate));
	let created = $derived(parseISO(issue.createdAt));

	// Überfällig = das Ende des Fälligkeitstages liegt in der Vergangenheit.
	// Bei Done/Archiv ist das egal, die sind ja erledigt.
	let overdue = $derived(isPast(endOfDay(due)) && issue.lane !== 'done' && issue.lane !== 'archive');

	const PRIORITY = { low: 'Niedrig', medium: 'Mittel', high: 'Hoch' };

	// Drag & Drop (native HTML5-API, keine Library):
	// Beim Start speichern wir die ID im dataTransfer, die Lane liest sie beim Drop aus.
	function onDragStart(event) {
		event.dataTransfer.setData('text/plain', issue.id);
		dragging = true;
	}
</script>

<article
	draggable="true"
	ondragstart={onDragStart}
	ondragend={() => (dragging = false)}
	class="cursor-grab rounded-md border-2 bg-sheet p-4
		{overdue ? 'border-alert' : 'border-transparent'}
		{dragging ? 'opacity-40' : ''}"
>
	<!-- Visuelle Warnung bei Überfälligkeit: roter Rahmen + Hinweistext -->
	{#if overdue}
		<p class="mb-2 text-sm font-bold text-alert">Überfällig</p>
	{/if}

	<div class="flex items-start justify-between gap-3">
		<h3 class="font-display text-lg leading-snug font-semibold">{issue.title}</h3>
		<span class="shrink-0 font-display text-lg">
			{issue.points}<span class="ml-0.5 text-sm text-muted">SP</span>
		</span>
	</div>

	{#if issue.description}
		<p class="mt-1 text-sm text-muted">{issue.description}</p>
	{/if}

	<!-- date-fns: format = festes Datum, formatDistanceToNow = relative Angabe -->
	<p class="mt-3 text-sm">
		<span class="text-muted">Fällig:</span>
		<span class={overdue ? 'text-alert' : ''}>{format(due, 'EEE, d. MMM yyyy', { locale: de })}</span>
	</p>
	<p class="text-sm">
		<span class="text-muted">Erstellt:</span>
		{formatDistanceToNow(created, { addSuffix: true, locale: de })}
	</p>
	<p class="text-sm">
		<span class="text-muted">Priorität:</span>
		{PRIORITY[issue.priority]}
	</p>

	<!-- Aktionen: ICS-Export und Teilen -->
	<div class="mt-3 flex gap-4 border-t border-line pt-2 text-sm">
		<button class="hover:underline" onclick={() => exportIcs(issue)}>Kalender (.ics)</button>
		<button class="hover:underline" onclick={() => shareIssue(issue)}>Teilen</button>
	</div>
</article>
