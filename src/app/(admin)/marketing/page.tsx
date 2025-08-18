
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

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Marketing Campaigns" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Send a message to all customers who have enabled notifications.</CardDescription>
            </CardHeader>
            <CardContent>
                <NotificationForm />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
