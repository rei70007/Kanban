<script>
	// Eine Spalte (Lane) des Boards. Hier werden Karten "abgelegt" (Drop-Ziel).
	import IssueCard from './IssueCard.svelte';
	import { moveIssue } from '#lib/store.svelte.js';
	import { notify } from '#lib/notify.js';

	// lane = { id, title }, issues = nur die Issues dieser Lane
	let { lane, issues } = $props();

	// true, solange eine Karte über dieser Lane schwebt (für Hervorhebung)
	let over = $state(false);

	// Summe der Story Points dieser Lane. $derived rechnet automatisch neu.
	let total = $derived(issues.reduce((sum, issue) => sum + issue.points, 0));

	// dragover: preventDefault() ist PFLICHT, sonst erlaubt der Browser kein Drop
	function onDragOver(event) {
		event.preventDefault();
		over = true;
	}

	function onDrop(event) {
		event.preventDefault();
		over = false;
		const id = event.dataTransfer.getData('text/plain'); // ID aus IssueCard
		const moved = moveIssue(id, lane.id);

		// Anforderung: Notification, wenn ein Item auf Done gestellt wird
		if (moved && lane.id === 'done') {
			notify('Erledigt', `„${moved.title}“ ist jetzt Done.`);
		}
	}
</script>

<section
	ondragover={onDragOver}
	ondragleave={() => (over = false)}
	ondrop={onDrop}
	class="flex min-h-64 flex-col rounded-lg p-3 {over ? 'bg-sheet/70' : ''}"
>
	<header class="mb-4">
		<div class="flex items-end justify-between">
			<h2 class="font-display text-xl font-semibold">{lane.title}</h2>
			<!-- Summe der Story Points pro Lane -->
			<p class="font-display text-5xl leading-none font-extralight">
				{total}<span class="ml-1 text-base font-normal text-muted">SP</span>
			</p>
		</div>
		<!-- Farbstreifen in der Lane-Farbe -->
		<div class="mt-2 h-1 rounded-full" style="background: var(--color-lane-{lane.id})"></div>
	</header>

	<div class="flex flex-col gap-3">
		<!-- (issue.id) = Key, damit Svelte die Karten beim Verschieben richtig zuordnet -->
		{#each issues as issue (issue.id)}
			<IssueCard {issue} />
		{/each}
	</div>
</section>
