// Browser-Benachrichtigungen (Notification API)
import { asset } from '$app/paths';

// Erlaubnis anfragen. Muss durch einen Klick ausgelöst werden (Browser-Regel).
export async function askPermission() {
	if (!('Notification' in window)) return 'unsupported';
	return Notification.requestPermission(); // 'granted' | 'denied' | 'default'
}

// Benachrichtigung anzeigen, wenn erlaubt
export async function notify(title, body) {
	if (!('Notification' in window) || Notification.permission !== 'granted') return;

	const options = { body, icon: asset('/icon-192.png') };

	// Als installierte PWA (v. a. Android) geht "new Notification" nicht,
	// dort muss man die Benachrichtigung über den Service Worker anzeigen.
	const registration = await navigator.serviceWorker?.getRegistration();
	if (registration) {
		registration.showNotification(title, options);
	} else {
		new Notification(title, options);
	}
}
