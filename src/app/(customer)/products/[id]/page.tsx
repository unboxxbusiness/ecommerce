
import { getProduct } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';

export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
