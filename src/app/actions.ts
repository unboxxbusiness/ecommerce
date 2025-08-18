
'use server';

import { optimizeProductDescription } from '@/ai/flows/optimize-product-description';
import { sendNotificationToAll } from '@/lib/notifications-admin';
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

const sendNotificationSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    message: z.string().min(1, 'Message is required.'),
});

export async function handleSendNotification(formData: FormData) {
    const rawData = {
        title: formData.get('title'),
        message: formData.get('message'),
    };

    const validation = sendNotificationSchema.safeParse(rawData);

    if(!validation.success) {
        return { error: 'Invalid input.', fieldErrors: validation.error.flatten().fieldErrors };
    }

    try {
        const result = await sendNotificationToAll({
            title: validation.data.title,
            body: validation.data.message
        });

        if (result.successCount > 0) {
            return { success: `Successfully sent notification to ${result.successCount} device(s).` };
        } else {
            return { error: `Failed to send notifications. ${result.failureCount} tokens failed.` };
        }

    } catch (error) {
        console.error('Failed to send notification:', error);
        return { error: 'An unexpected error occurred.' };
    }
}
