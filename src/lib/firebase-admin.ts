// src/lib/firebase-admin.ts

import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// This is the crucial fix:
// It takes the private key string from the environment variable
// and replaces all literal '\\n' substrings with actual newline characters.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      // Pass the formatted private key here
      privateKey,
    }),
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };