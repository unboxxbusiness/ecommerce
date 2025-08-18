
'use server';

import { optimizeProductDescription } from '@/ai/flows/optimize-product-description';
import { sendNotificationToAll } from '@/lib/notifications-admin';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { serverTimestamp } from 'firebase/firestore';
import { updateSiteContent as adminUpdateSiteContent } from '@/lib/firestore-admin';
import type { SiteContent } from '@/lib/types';
import { cookies } from 'next/headers';


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

export async function handlePasswordReset(email: string) {
    if (!email) {
        return { error: 'Email is required.' };
    }
    try {
        // This will throw an error if the user doesn't exist, which we catch.
        await adminAuth.getUserByEmail(email); 
        await adminAuth.generatePasswordResetLink(email);
        return { success: true };
    } catch(error: any) {
        console.error("Failed to send password reset email:", error);
         if (error.code === 'auth/user-not-found') {
            return { error: 'No account found with that email address.' };
        }
        return { error: "An unexpected error occurred while trying to send the reset email." };
    }
}

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function handleSignup(formData: FormData) {
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const validation = signupSchema.safeParse(rawData);
    if (!validation.success) {
        return { error: "Invalid email or password. Password must be at least 6 characters." };
    }
    
    const { email, password } = validation.data;

    try {
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: email.split('@')[0],
        });

        const customerRef = adminDb.collection('customers').doc(userRecord.uid);
        await customerRef.set({
            name: userRecord.displayName || email.split('@')[0],
            email: email,
            avatar: `https://placehold.co/100x100.png`,
            totalOrders: 0,
            totalSpent: 0,
            joinDate: serverTimestamp(),
            isActive: true,
            role: 'customer',
        });

        return { success: true, uid: userRecord.uid };

    } catch (error: any) {
        console.error("Signup failed:", error);
        if (error.code === 'auth/email-already-exists') {
            return { error: 'An account with this email already exists.' };
        }
        return { error: 'Failed to create account. Please try again.' };
    }
}

// Helper function to verify admin user from session cookie
async function verifyAdmin() {
    const sessionCookie = cookies().get('__session')?.value || '';
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        if (decodedClaims.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            return decodedClaims;
        }
        return null;
    } catch (error) {
        return null;
    }
}


export async function handleUpdateSiteContent(contentData: Partial<SiteContent>) {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
        return { error: 'Authentication error: You are not authorized to perform this action.' };
    }

    try {
        await adminUpdateSiteContent(contentData);
        return { success: true };
    } catch (error) {
        console.error('Failed to update site content:', error);
        return { error: 'An unexpected server error occurred while updating content.' };
    }
}
