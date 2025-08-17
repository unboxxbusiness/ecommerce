
import 'server-only';

import { adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Product, Order, Customer } from './types';

// These functions use the ADMIN SDK and are for SERVER-SIDE use only.

async function fetchCollection<T>(collectionName: string): Promise<T[]> {
    try {
        const collectionRef = adminDb.collection(collectionName);
        const querySnapshot = await collectionRef.get();
        const data: T[] = [];
        
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            // Convert Firestore Timestamps to serializable strings
            for (const key in docData) {
                if (docData[key] instanceof Timestamp) {
                    docData[key] = (docData[key] as Timestamp).toDate().toISOString();
                }
            }
            data.push({ id: doc.id, ...docData } as T);
        });
        return data;
    } catch (error) {
        console.error(`Failed to fetch collection ${collectionName}:`, error);
        // Depending on the use case, you might want to return an empty array
        // or re-throw the error. For now, we return an empty array to prevent crashes.
        return [];
    }
}

// Product functions for admin
export const getAdminProducts = () => fetchCollection<Product>('products');

// Order functions for admin
export const getAdminOrders = () => fetchCollection<Order>('orders');

// Customer functions for admin
export const getAdminCustomers = () => fetchCollection<Customer>('customers');
