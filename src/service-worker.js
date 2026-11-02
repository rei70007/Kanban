// Service Worker: macht die App offline-fähig (wird von SvelteKit automatisch registriert)
import { version } from '$app/env'; // ändert sich bei jedem Build
import { immutable, assets, prerendered } from '$app/manifest'; // Listen aller Dateien
import { resolve, asset } from '$app/paths';

// Pro Version ein eigener Cache
const CACHE = `cache-${version}`;

// Alle Dateien der App: gebautes JS/CSS + static-Ordner + die fertige Seite
const ASSETS = [
	...immutable.map((f) => resolve(f.path)),
	...assets.map((f) => asset(f.path)),
	...prerendered.map((f) => resolve(f.path))
];

// install: alle Dateien in den Cache speichern
self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

// activate: alte Caches löschen
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== CACHE) await caches.delete(key);
			}
		})
	);
});

// fetch: zuerst im Cache suchen, sonst aus dem Internet laden
self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	event.respondWith(
		caches.match(event.request).then((cached) => {
			return cached || fetch(event.request);
		})
	);
});
