
// This file needs to be in the public directory

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: '__NEXT_PUBLIC_FIREBASE_API_KEY__',
  authDomain: '__NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN__',
  projectId: '__NEXT_PUBLIC_FIREBASE_PROJECT_ID__',
  storageBucket: '__NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET__',
  messagingSenderId: '__NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID__',
  appId: '__NEXT_PUBLIC_FIREBASE_APP_ID__',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Or your desired icon
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
