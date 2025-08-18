
import * as React from 'react';
import { PageForm } from '../../page-form';
import { Header } from '@/components/header';
import { getAdminPage } from '@/lib/firestore-admin';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const page = await getAdminPage(params.id);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Edit Page" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle>Edit Page Details</CardTitle>
                <CardDescription>Update the information for the page below.</CardDescription>
            </CardHeader>
            <CardContent>
                 <PageForm page={page} />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
