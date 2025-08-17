import * as admin from 'firebase-admin';

// This is a server-only file.

if (!admin.apps.length) {
  const privateKey = process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FB_PROJECT_ID) {
    throw new Error('Missing Firebase project ID');
  }
  if (!process.env.FB_CLIENT_EMAIL) {
    throw new Error('Missing Firebase client email');
  }
  if (!privateKey) {
    throw new Error('Missing Firebase private key');
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FB_PROJECT_ID,
        clientEmail: process.env.FB_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
    throw new Error('Could not initialize Firebase Admin SDK');
  }
}

const adminDb = admin.firestore();

export { adminDb };
