
'use server';
export const dynamic = 'force-dynamic';

import { optimizeProductDescription } from '@/ai/flows/optimize-product-description';
import { sendNotificationToAll } from '@/lib/notifications-admin';
import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { serverTimestamp } from 'firebase/firestore';
import { updateSiteContent as adminUpdateSiteContent, deletePage as adminDeletePage, deleteProduct as adminDeleteProduct } from '@/lib/firestore-admin';
import type { Page, SiteContent, Product } from '@/lib/types';
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

        const batch = adminDb.batch();

        const customerRef = adminDb.collection('customers').doc(userRecord.uid);
        const customerData = {
            name: userRecord.displayName || email.split('@')[0],
            email: email,
            avatar: `https://placehold.co/100x100.png`,
            totalOrders: 0,
            totalSpent: 0,
            joinDate: serverTimestamp(),
            isActive: true,
            role: 'customer',
        };
        batch.set(customerRef, customerData);

        if (email === process.env.ADMIN_EMAIL) {
            const adminRef = adminDb.collection('admins').doc(userRecord.uid);
            batch.set(adminRef, { role: 'admin', createdAt: serverTimestamp() });
        }

        await batch.commit();

        return { success: true, uid: userRecord.uid };

    } catch (error: any) {
        console.error("Signup failed:", error);
        if (error.code === 'auth/email-already-exists') {
            return { error: 'An account with this email already exists.' };
        }
        return { error: 'Failed to create account. Please try again.' };
    }
}

async function verifyAdmin() {
    const sessionCookie = cookies().get('__session')?.value || '';
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        if (!decodedClaims.uid) {
            return null;
        }
        const adminDoc = await adminDb.collection('admins').doc(decodedClaims.uid).get();
        if (adminDoc.exists) {
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

const pageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  content: z.string().min(10, 'Content is required.'),
  isPublished: z.boolean(),
});


export async function handleCreatePage(data: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
        return { error: 'Authentication error: You are not authorized to perform this action.' };
    }

    const validation = pageSchema.safeParse(data);
    if (!validation.success) {
        return { error: 'Invalid page data.', fieldErrors: validation.error.flatten().fieldErrors };
    }
    
    try {
        const pageRef = adminDb.collection('pages');
        const now = new Date().toISOString();
        const newPage = {
            ...validation.data,
            createdAt: now,
            updatedAt: now,
        }
        await pageRef.add(newPage);
        return { success: true };
    } catch(error) {
        console.error("Failed to create page:", error);
        return { error: 'An unexpected server error occurred while creating the page.' };
    }
}

export async function handleUpdatePage(id: string, data: Partial<Page>) {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
        return { error: 'Authentication error: You are not authorized to perform this action.' };
    }
    
    const validation = pageSchema.partial().safeParse(data);
    if (!validation.success) {
        return { error: 'Invalid page data.', fieldErrors: validation.error.flatten().fieldErrors };
    }
    
     try {
        const pageRef = adminDb.collection('pages').doc(id);
        const updatedPage = {
            ...validation.data,
            updatedAt: new Date().toISOString(),
        }
        await pageRef.update(updatedPage);
        return { success: true };
    } catch(error) {
        console.error("Failed to update page:", error);
        return { error: 'An unexpected server error occurred while updating the page.' };
    }
}

export async function handleDeletePage(id: string) {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
        return { error: 'Authentication error: You are not authorized to perform this action.' };
    }

    try {
        await adminDeletePage(id);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete page:', error);
        return { error: 'An unexpected server error occurred while deleting the page.' };
    }
}

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  image: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
  category: z.string().min(2, 'Category is required'),
});

export async function handleCreateProduct(values: Omit<Product, 'id' | 'rating' | 'popularity' | 'reviews' | 'variants'>) {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
        return { error: 'Authentication error: You are not authorized to perform this action.' };
    }
    const validation = productSchema.safeParse(values);
    if (!validation.success) {
        return { error: 'Invalid product data.', fieldErrors: validation.error.flatten().fieldErrors };
    }
    try {
        const newProductData = {
            ...validation.data,
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            popularity: Math.floor(Math.random() * 1000),
            reviews: [],
            variants: [],
        };
        const docRef = await adminDb.collection('products').add(newProductData);
        return { success: true, productId: docRef.id };
    } catch(err) {
        console.error("Product creation failed:", err);
        return { error: 'Failed to create product.' };
    }
}

export async function handleUpdateProduct(id: string, values: Partial<Product>) {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
        return { error: 'Authentication error: You are not authorized to perform this action.' };
    }
    const validation = productSchema.partial().safeParse(values);
     if (!validation.success) {
        return { error: 'Invalid product data.', fieldErrors: validation.error.flatten().fieldErrors };
    }
    try {
        const productRef = adminDb.collection('products').doc(id);
        await productRef.update(validation.data);
        return { success: true };
    } catch(err) {
        console.error("Product update failed:", err);
        return { error: 'Failed to update product.' };
    }
}

export async function handleDeleteProduct(id: string) {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
        return { error: 'Authentication error: You are not authorized to perform this action.' };
    }
    try {
        await adminDeleteProduct(id);
        return { success: true };
    } catch(err) {
        console.error("Product deletion failed:", err);
        return { error: 'Failed to delete product.' };
    }
}
