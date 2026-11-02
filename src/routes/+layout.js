// prerender: SvelteKit erzeugt beim Build eine fertige index.html.
// ssr = false: Die Seite wird nur im Browser gerendert, weil wir localStorage brauchen
// (localStorage gibt es auf dem Server/beim Build nicht).
export const prerender = true;
export const ssr = false;
