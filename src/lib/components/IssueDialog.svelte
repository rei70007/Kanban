<script>
	// Formular zum Anlegen eines Issues im nativen HTML-<dialog>-Element
	import { format, addDays } from 'date-fns';
	import { addIssue } from '#lib/store.svelte.js';

	let dialog; // Referenz auf das <dialog>-Element (über bind:this)

	// Startwerte des Formulars. Due-Date standardmäßig in einer Woche.
	function emptyForm() {
		return {
			title: '',
			description: '',
			dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
			points: 3,
			priority: 'medium'
		};
	}

	let form = $state(emptyForm());

	// "export" macht die Funktion von außen aufrufbar: dialogRef.open()
	export function open() {
		form = emptyForm();
		dialog.showModal(); // als Modal öffnen (mit Backdrop, Esc schließt)
	}

	function onSubmit(event) {
		event.preventDefault(); // Seite nicht neu laden
		addIssue(form);
		dialog.close();
	}

	// Story Points nach Fibonacci-Reihe (üblich in Scrum)
	const POINTS = [1, 2, 3, 5, 8, 13];
</script>

<dialog
	bind:this={dialog}
	aria-labelledby="dialog-title"
	class="m-auto w-[min(32rem,calc(100%-2rem))] rounded-lg border border-line bg-sheet p-0 text-ink"
>
	<form onsubmit={onSubmit} class="flex flex-col gap-4 p-6">
		<h2 id="dialog-title" class="font-display text-2xl font-semibold">Neues Issue</h2>

		<label class="flex flex-col gap-1">
			<span class="text-sm font-bold">Titel</span>
			<input required bind:value={form.title} class="rounded-md border border-line bg-white px-3 py-2" />
		</label>

		<label class="flex flex-col gap-1">
			<span class="text-sm font-bold">Beschreibung</span>
			<textarea
				rows="3"
				bind:value={form.description}
				class="rounded-md border border-line bg-white px-3 py-2"
			></textarea>
		</label>

		<div class="grid grid-cols-2 gap-4">
			<label class="flex flex-col gap-1">
				<span class="text-sm font-bold">Fällig am</span>
				<input
					type="date"
					required
					bind:value={form.dueDate}
					class="rounded-md border border-line bg-white px-3 py-2"
				/>
			</label>

			<label class="flex flex-col gap-1">
				<span class="text-sm font-bold">Story Points</span>
				<select bind:value={form.points} class="rounded-md border border-line bg-white px-3 py-2">
					{#each POINTS as p}
						<option value={p}>{p}</option>
					{/each}
				</select>
			</label>
		</div>

		<!-- Priorität als Radio-Buttons -->
		<fieldset class="flex flex-col gap-1">
			<legend class="mb-1 text-sm font-bold">Priorität</legend>
			<div class="flex gap-2">
				{#each [['low', 'Niedrig'], ['medium', 'Mittel'], ['high', 'Hoch']] as [value, label]}
					<label
						class="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center
							has-checked:border-ink has-checked:bg-ink has-checked:text-sheet
							border-line bg-white"
					>
						<input type="radio" name="priority" {value} bind:group={form.priority} class="sr-only" />
						{label}
					</label>
				{/each}
			</div>
		</fieldset>

		<div class="mt-2 flex justify-end gap-2">
			<!-- type="button", damit dieser Button das Formular NICHT absendet -->
			<button type="button" onclick={() => dialog.close()} class="rounded-md px-4 py-2 hover:bg-stone">
				Abbrechen
			</button>
			<button type="submit" class="rounded-md bg-ink px-4 py-2 font-bold text-sheet hover:bg-ink/85">
				Issue anlegen
			</button>
		</div>
	</form>
</dialog>
