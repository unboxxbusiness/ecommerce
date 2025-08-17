'use server';

import { optimizeProductDescription } from '@/ai/flows/optimize-product-description';
import { z } from 'zod';

const optimizeDescriptionSchema = z.object({
  productName: z.string(),
  productDescription: z.string(),
  keywords: z.string(),
});

export async function handleOptimizeDescription(formData: FormData) {
  const rawData = {
    productName: formData.get('productName'),
    productDescription: formData.get('productDescription'),
    keywords: formData.get('keywords'),
  };

  const validation = optimizeDescriptionSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await optimizeProductDescription(validation.data);
    return { optimizedDescription: result.optimizedDescription };
  } catch (error) {
    console.error('AI optimization failed:', error);
    return { error: 'Failed to optimize description. Please try again.' };
  }
}
