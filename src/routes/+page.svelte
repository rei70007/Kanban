<script>
	// Die Hauptseite setzt nur die Komponenten zusammen.
	import Header from '#lib/components/Header.svelte';
	import Lane from '#lib/components/Lane.svelte';
	import IssueDialog from '#lib/components/IssueDialog.svelte';
	import { board, LANES } from '#lib/store.svelte.js';

	let dialog; // Referenz auf die IssueDialog-Komponente (für dialog.open())
</script>

<Header onnew={() => dialog.open()} />

<!-- 4 Lanes: am Handy untereinander, am Tablet 2 nebeneinander, am Desktop 4 -->
<main class="grid gap-4 px-2 pb-12 sm:px-6 md:grid-cols-2 xl:grid-cols-4">
	{#each LANES as lane (lane.id)}
		<!-- Jede Lane bekommt nur ihre eigenen Issues -->
		<Lane {lane} issues={board.issues.filter((issue) => issue.lane === lane.id)} />
	{/each}
</main>

<IssueDialog bind:this={dialog} />
