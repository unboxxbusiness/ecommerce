
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
        return [];
    }
}

// Product functions for admin
export const getAdminProducts = () => fetchCollection<Product>('products');

export const getAdminProduct = async (id: string): Promise<Product | null> => {
    try {
        const docRef = adminDb.collection('products').doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const docData = docSnap.data();
             for (const key in docData) {
                if (docData[key] instanceof Timestamp) {
                    docData[key] = (docData[key] as Timestamp).toDate().toISOString();
                }
            }
            return { id: docSnap.id, ...docData } as Product;
        }
        return null;
    } catch(error) {
        console.error(`Failed to fetch product ${id}:`, error);
        return null;
    }
};

// Order functions for admin
export const getAdminOrders = () => fetchCollection<Order>('orders');

// Customer functions for admin
export const getAdminCustomers = () => fetchCollection<Customer>('customers');
