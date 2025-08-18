
'use client';

import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch, serverTimestamp, increment } from 'firebase/firestore';
import type { Order, Product, Customer } from './types';

// These functions use the CLIENT-SIDE SDK and are safe to use in client components.

export const getProducts = async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
}

export const getProduct = async (id: string): Promise<Product | null> => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
}

export const createProduct = async (productData: Omit<Product, 'id' | 'rating' | 'popularity' | 'reviews' | 'variants'>) => {
    const newProductData = {
        ...productData,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating between 3.0 and 5.0
        popularity: Math.floor(Math.random() * 1000),
        reviews: [],
        variants: [],
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

export const getCustomerOrders = async (userEmail: string): Promise<Order[]> => {
    const q = query(collection(db, 'orders'), where('customerEmail', '==', userEmail));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
};

export const createOrder = async (orderData: Omit<Order, 'id'>) => {
    const batch = writeBatch(db);

    // 1. Create the order document
    const orderRef = doc(collection(db, 'orders'));
    batch.set(orderRef, { ...orderData, date: serverTimestamp() });

    // 2. Update product stock
    for (const item of orderData.items) {
        const productRef = doc(db, 'products', item.id);
        batch.update(productRef, {
            stock: increment(-item.quantity)
        });
    }

    // 3. Update customer stats
    const customerQuery = query(collection(db, "customers"), where("email", "==", orderData.customerEmail));
    const customerSnapshot = await getDocs(customerQuery);
    
    if (!customerSnapshot.empty) {
        const customerDocRef = customerSnapshot.docs[0].ref;
        batch.update(customerDocRef, {
            totalOrders: increment(1),
            totalSpent: increment(orderData.total),
        });
    }

    // 4. Commit the batch
    await batch.commit();

    return orderRef.id;
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const orderRef = doc(db, 'orders', orderId);
    return updateDoc(orderRef, { status });
};

// Customer CRUD
export const createCustomer = (customerData: Omit<Customer, 'id' | 'joinDate' | 'totalOrders' | 'totalSpent'>) => {
    return addDoc(collection(db, 'customers'), {
        ...customerData,
        joinDate: serverTimestamp(),
        totalOrders: 0,
        totalSpent: 0,
    });
};

export const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    const customerRef = doc(db, 'customers', id);
    return updateDoc(customerRef, customerData);
};

export const deleteCustomer = (id: string) => {
    return deleteDoc(doc(db, 'customers', id));
};
