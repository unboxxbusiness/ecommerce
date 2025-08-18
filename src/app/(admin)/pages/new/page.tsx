
import * as React from 'react';
import { PageForm } from '../page-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NewPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Add New Page</h2>
        <Card>
            <CardHeader>
                <CardTitle>Create a New Page</CardTitle>
                <CardDescription>Fill in the details below to add a new content page.</CardDescription>
            </CardHeader>
            <CardContent>
                <PageForm />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
