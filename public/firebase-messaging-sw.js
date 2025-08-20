// DO NOT USE import/export BEYOND THIS POINT
// This file is a service worker and must be written in ES5
// and use importScripts to load other scripts.

try {
  importScripts(
    'https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js'
  );
  importScripts(
    'https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js'
  );

  const urlParams = new URLSearchParams(self.location.search);
  const firebaseConfig = {
    apiKey: urlParams.get('apiKey'),
    authDomain: urlParams.get('authDomain'),
    projectId: urlParams.get('projectId'),
    storageBucket: urlParams.get('storageBucket'),
    messagingSenderId: urlParams.get('messagingSenderId'),
    appId: urlParams.get('appId'),
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
      );
      
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon-192x192.png', // A default icon
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
} catch (e) {
  console.error('Service Worker Error', e);
}
