
import { getAdminProduct } from '@/lib/firestore-admin';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getAdminProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
