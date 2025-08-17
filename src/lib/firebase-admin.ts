import * as admin from 'firebase-admin';

// This is a server-only file.

if (!admin.apps.length) {
  const privateKey = process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FB_PROJECT_ID || !process.env.FB_CLIENT_EMAIL || !privateKey) {
    throw new Error(
      'Missing Firebase Admin SDK credentials. Please check your .env.local file.'
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const adminDb = admin.firestore();

export { adminDb };
