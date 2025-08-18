
import * as React from 'react';
import { ProductForm } from '../product-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NewProductPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
        <Card>
            <CardHeader>
                <CardTitle>Create a New Product</CardTitle>
                <CardDescription>Fill in the details below to add a new product to your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <ProductForm />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
