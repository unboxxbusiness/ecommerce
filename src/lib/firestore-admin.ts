
import 'server-only';

import { adminDb } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Product, Order, Customer } from './types';

// These functions use the ADMIN SDK and are for SERVER-SIDE use only.

async function fetchCollection<T>(collectionName: string): Promise<T[]> {
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
}

// Product functions for admin
export const getAdminProducts = () => fetchCollection<Product>('products');

// Order functions for admin
export const getAdminOrders = () => fetchCollection<Order>('orders');

// Customer functions for admin
export const getAdminCustomers = () => fetchCollection<Customer>('customers');
