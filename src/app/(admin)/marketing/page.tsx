
import * as React from 'react';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NotificationForm } from './notification-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Marketing Campaigns" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Push Notifications</CardTitle>
                    <CardDescription>Send a message to all customers who have enabled notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <NotificationForm />
                </CardContent>
            </Card>

            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>FCM Setup Required</AlertTitle>
              <AlertDescription>
                <p className="mb-4">To enable push notifications, you need to add your Firebase VAPID key to your environment variables.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Firebase Project Settings</a>.</li>
                    <li>Navigate to the "Cloud Messaging" tab.</li>
                    <li>Under "Web configuration", find or generate a "Web Push certificate" key pair.</li>
                    <li>Create a file named <code>.env.local</code> in the root of your project (if it does not exist).</li>
                    <li>Copy the key pair and add it to your <code>.env.local</code> file like this:</li>
                </ol>
                <pre className="mt-4 p-3 bg-background rounded-md text-sm whitespace-pre-wrap">
                  <code>
                    {`NEXT_PUBLIC_FIREBASE_VAPID_KEY=YOUR_GENERATED_VAPID_KEY`}
                  </code>
                </pre>
                 <p className="text-sm mt-4 text-muted-foreground">
                  <strong>Important:</strong> After saving the <code>.env.local</code> file, you must restart your development server for the changes to take effect.
                </p>
              </AlertDescription>
            </Alert>
        </div>

      </main>
    </div>
  );
}
