
import * as React from 'react';
import { ProductForm } from '../../product-form';
import { Header } from '@/components/header';
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
      <Header title="Edit Product">
        <Button variant="outline" size="sm" asChild>
            <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Link>
        </Button>
      </Header>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
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
