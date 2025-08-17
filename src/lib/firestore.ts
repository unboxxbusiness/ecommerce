
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, DocumentData } from 'firebase/firestore';
import type { Product, Order, Customer, Review } from './types';

// Generic fetch function
async function fetchCollection<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: T[] = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as T);
    });
    return data;
}

async function fetchDocument<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
        return null;
    }
}


// Product functions
export const getProducts = () => fetchCollection<Product>('products');
export const getProduct = (id: string) => fetchDocument<Product>('products', id);

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
