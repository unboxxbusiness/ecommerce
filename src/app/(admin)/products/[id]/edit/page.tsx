
import * as React from 'react';
import { ProductForm } from '../../product-form';
import { getAdminProduct } from '@/lib/firestore-admin';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getAdminProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/products">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Edit Product Details</CardTitle>
                <CardDescription>Update the information for your product below.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ProductForm product={product} />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
