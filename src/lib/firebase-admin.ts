import * as admin from 'firebase-admin';

// This is a server-only file.

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FB_PROJECT_ID!,
  privateKey: process.env.FB_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  clientEmail: process.env.FB_CLIENT_EMAIL!,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();

export { adminDb };
