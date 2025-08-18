
'use client';

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { saveFcmToken } from '@/lib/firestore';
import { useToast } from './use-toast';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
    }

    const messaging = getMessaging(app);
    
    // We need to encode the config values to pass them to the service worker
    const firebaseConfigParams = new URLSearchParams({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
    }).toString();

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${firebaseConfigParams}`);
        console.log('Service Worker registered successfully.');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };
    
    registerServiceWorker();

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted' && user) {
          if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
            console.error("Firebase VAPID key is missing from environment variables.");
            return;
          }
          const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
          if (currentToken) {
            console.log('FCM Token:', currentToken);
            await saveFcmToken(user.uid, currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }
      } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
      }
    };

    if (user) {
      requestPermission();
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      toast({
        title: payload.notification?.title,
        description: payload.notification?.body,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [user, toast]);
};
