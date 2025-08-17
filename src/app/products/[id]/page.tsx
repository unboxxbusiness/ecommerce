
import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
