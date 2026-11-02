<script>
	// Das Layout umschließt jede Seite. Hier laden wir nur das globale CSS.
	import '../app.css';

	// children = der Inhalt der aktuellen Seite (+page.svelte)
	let { children } = $props();
</script>

{@render children()}
