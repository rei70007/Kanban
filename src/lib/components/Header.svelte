<script>
	// Kopfzeile: Titel + Buttons (Benachrichtigungen, CSV-Export, Neues Issue)
	import { board } from '#lib/store.svelte.js';
	import { exportCsv } from '#lib/export.js';
	import { askPermission } from '#lib/notify.js';

	// onnew = Funktion vom Eltern-Element, öffnet den Dialog
	let { onnew } = $props();

	// Aktueller Status der Notification-Erlaubnis
	let permission = $state('Notification' in window ? Notification.permission : 'unsupported');

	async function enableNotifications() {
		permission = await askPermission();
	}
</script>

<header class="flex flex-wrap items-end justify-between gap-4 px-4 pt-8 pb-6 sm:px-8">
	<div>
		<h1 class="font-display text-4xl font-bold tracking-tight">Kanban</h1>
		<p class="text-muted">{board.issues.length} Issues auf dem Board</p>
	</div>

	<nav class="flex flex-wrap gap-2">
		<!-- Nur anzeigen, solange noch nicht gefragt wurde -->
		{#if permission === 'default'}
			<button onclick={enableNotifications} class="rounded-md border border-ink/30 px-4 py-2 hover:bg-sheet">
				Benachrichtigungen aktivieren
			</button>
		{/if}

		<button
			onclick={() => exportCsv(board.issues)}
			disabled={board.issues.length === 0}
			class="rounded-md border border-ink/30 px-4 py-2 hover:bg-sheet disabled:opacity-40"
		>
			CSV exportieren
		</button>

		<button onclick={onnew} class="rounded-md bg-ink px-4 py-2 font-bold text-sheet hover:bg-ink/85">
			Neues Issue
		</button>
	</nav>
</header>
