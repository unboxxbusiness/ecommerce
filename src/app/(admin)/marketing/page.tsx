
import * as React from 'react';
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
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h2>
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
                To enable push notifications, you must add your Firebase VAPID key to your environment variables. Please see the <strong>Settings &gt; Setup</strong> tab for complete instructions.
              </AlertDescription>
            </Alert>
        </div>

      </main>
    </div>
  );
}
