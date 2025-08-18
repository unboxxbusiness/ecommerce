
// Scripts for Firebase products are imported in the HTML file, so they are available to the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// Note: This is safe to expose. GCM/FCM use this to identify the app.
const urlParams = new URLSearchParams(location.search);
const firebaseConfig = Object.fromEntries(urlParams.entries());

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Optional: path to an icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
