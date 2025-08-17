
import { db } from './firebase';
import { adminDb } from './firebase-admin';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, DocumentData, Timestamp } from 'firebase/firestore';
import type { Product, Order, Customer } from './types';

const isServer = typeof window === 'undefined';

// Generic fetch function
async function fetchCollection<T>(collectionName: string): Promise<T[]> {
    const dbInstance = isServer ? adminDb : db;
    const collectionRef = isServer ? (dbInstance as FirebaseFirestore.Firestore).collection(collectionName) : collection(dbInstance as any, collectionName);
    
    const querySnapshot = await (isServer ? (collectionRef as FirebaseFirestore.CollectionReference).get() : getDocs(collectionRef));
    const data: T[] = [];
    
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        // Convert Firestore Timestamps to serializable strings on the server
        if (isServer) {
            for (const key in docData) {
                if (docData[key] instanceof Timestamp) {
                    docData[key] = (docData[key] as Timestamp).toDate().toISOString();
                }
            }
        }
        data.push({ id: doc.id, ...docData } as T);
    });
    return data;
}

async function fetchDocument<T>(collectionName: string, id: string): Promise<T | null> {
    const dbInstance = isServer ? adminDb : db;
    const docRef = isServer ? (dbInstance as FirebaseFirestore.Firestore).collection(collectionName).doc(id) : doc(db, collectionName, id);

    const docSnap = await (isServer ? (docRef as FirebaseFirestore.DocumentReference).get() : getDoc(docRef));

    if (docSnap.exists) {
        const docData = docSnap.data();
         if (isServer && docData) {
            for (const key in docData) {
                if (docData[key] instanceof Timestamp) {
                    docData[key] = (docData[key] as Timestamp).toDate().toISOString();
                }
            }
        }
        return { id: docSnap.id, ...docData } as T;
    } else {
        return null;
    }
}


// Product functions
export const getProducts = () => fetchCollection<Product>('products');
export const getProduct = (id: string) => fetchDocument<Product>('products', id);

// These actions are called from client components, so they will use the client SDK.
export const createProduct = async (productData: Omit<Product, 'id' | 'rating' | 'popularity' | 'reviews'>) => {
    // Add default values for fields not in the form
    const newProductData = {
        ...productData,
        rating: 0,
        popularity: 0,
        reviews: [],
        variants: [], // Add default empty variants
    };
    const docRef = await addDoc(collection(db, 'products'), newProductData);
    return docRef.id;
};

export const updateProduct = (id: string, productData: Partial<Product>) => {
    const productRef = doc(db, 'products', id);
    return updateDoc(productRef, productData);
};

export const deleteProduct = (id: string) => {
    return deleteDoc(doc(db, 'products', id));
};


// Order functions
export const getOrders = () => fetchCollection<Order>('orders');

// This action is called from a client component
export const getCustomerOrders = async (userEmail: string) => {
    const q = query(collection(db, 'orders'), where('customerEmail', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
}

// Customer functions
export const getCustomers = () => fetchCollection<Customer>('customers');
