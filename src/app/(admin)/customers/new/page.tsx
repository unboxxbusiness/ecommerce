
import * as React from 'react';
import { CustomerForm } from '../customer-form';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NewCustomerPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Add New Customer" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle>Create a New Customer</CardTitle>
                <CardDescription>Fill in the details below to add a new customer.</CardDescription>
            </CardHeader>
            <CardContent>
                <CustomerForm />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
