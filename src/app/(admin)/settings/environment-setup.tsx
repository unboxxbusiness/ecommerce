
'use client';

export function EnvironmentSetup() {
  
  const envTemplate = `
# Firebase Admin SDK (Server-Side)
# Go to Firebase Console > Project Settings > Service Accounts > Generate new private key
FB_CLIENT_EMAIL=...
FB_PRIVATE_KEY=...

# Firebase Client SDK (Client-Side)
# Go to Firebase Console > Project Settings > General > Your apps > Web app
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Cloud Messaging (FCM) VAPID Key
# Go to Firebase Console > Project Settings > Cloud Messaging > Web configuration > Web Push certificates
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...

# Admin User Email
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com

# Razorpay API Keys
# Go to your Razorpay Dashboard > Settings > API Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Google Analytics Measurement ID (Optional)
# Go to Google Analytics > Admin > Data Streams > Select your stream
NEXT_PUBLIC_GA_ID=...
  `.trim();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">
          Create a file named <code>.env.local</code> in the root of your project directory and add the following variables. This file stores sensitive credentials and should not be committed to version control.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-muted/50">
        <pre className="text-sm whitespace-pre-wrap">
          <code>
            {envTemplate}
          </code>
        </pre>
         <p className="text-sm mt-4 text-muted-foreground">
          <strong>Important:</strong> After creating or modifying the <code>.env.local</code> file, you must restart your development server for the changes to take effect.
        </p>
      </div>
    </div>
  );
}
