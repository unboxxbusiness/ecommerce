
import 'server-only';

import { adminDb } from './firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import type { Product, Order, Customer, Coupon, SiteContent } from './types';

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

export const getAdminCustomer = async (id: string): Promise<Customer | null> => {
    try {
        const docRef = adminDb.collection('customers').doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const docData = docSnap.data();
             for (const key in docData) {
                if (docData[key] instanceof Timestamp) {
                    docData[key] = (docData[key] as Timestamp).toDate().toISOString();
                }
            }
            return { id: docSnap.id, ...docData } as Customer;
        }
        return null;
    } catch(error) {
        console.error(`Failed to fetch customer ${id}:`, error);
        return null;
    }
};

// Coupon functions for admin
export const getAdminCoupons = () => fetchCollection<Coupon>('coupons');

export const getAdminCoupon = async (id: string): Promise<Coupon | null> => {
    try {
        const docRef = adminDb.collection('coupons').doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const docData = docSnap.data();
             for (const key in docData) {
                if (docData[key] instanceof Timestamp) {
                    docData[key] = (docData[key] as Timestamp).toDate().toISOString();
                }
            }
            return { id: docSnap.id, ...docData } as Coupon;
        }
        return null;
    } catch(error) {
        console.error(`Failed to fetch coupon ${id}:`, error);
        return null;
    }
};

// Site Content functions
const defaultSiteContent: SiteContent = {
  global: {
    siteName: 'Digital Shop',
    logoUrl: '/logo.png', // Default logo path
    footerLinks: [
      { id: '1', text: 'Terms of Service', url: '/terms' },
      { id: '2', text: 'Privacy Policy', url: '/privacy' },
    ],
  },
  homePage: {
    hero: {
      show: true,
      title: 'Discover Our Unique Collection',
      subtitle: 'Handcrafted goods, sustainable products, and timeless designs for your modern lifestyle.',
      ctaText: 'Shop Now',
      ctaLink: '/',
      imageUrl: 'https://placehold.co/1200x600.png',
    },
    testimonials: {
      show: true,
      title: 'What Our Customers Are Saying',
      items: [
        {
          id: '1',
          quote: "The quality is outstanding, and the customer service is second to none. I'm a customer for life!",
          author: 'Jane Doe',
          authorRole: 'Verified Buyer',
        },
        {
          id: '2',
          quote: 'I love the unique designs and the sustainable mission behind this brand. Highly recommend!',
          author: 'John Smith',
          authorRole: 'Design Enthusiast',
        },
      ],
    },
    ctaBlock: {
      show: true,
      title: "Ready to Find Your Next Favorite Thing?",
      subtitle: "Browse our full catalog to discover products you'll love.",
      ctaText: "Explore All Products",
      ctaLink: "/"
    }
  },
};

export const getSiteContent = async (): Promise<SiteContent> => {
  try {
    const docRef = adminDb.collection('siteContent').doc('main');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      // If the document doesn't exist, create it with default data
      await docRef.set(defaultSiteContent);
      return defaultSiteContent;
    }
    
    // Merge with defaults to ensure all properties exist
    const data = docSnap.data() as Partial<SiteContent>;
    const homePageData = data.homePage || {};
    return {
        global: { ...defaultSiteContent.global, ...data.global },
        homePage: {
            hero: { ...defaultSiteContent.homePage.hero, ...homePageData.hero },
            testimonials: { ...defaultSiteContent.homePage.testimonials, ...homePageData.testimonials },
            ctaBlock: { ...defaultSiteContent.homePage.ctaBlock, ...homePageData.ctaBlock },
        }
    };
  } catch (error) {
    console.error('Failed to fetch site content:', error);
    return defaultSiteContent;
  }
};


export const updateSiteContent = (contentData: Partial<SiteContent>) => {
    const contentRef = adminDb.collection('siteContent').doc('main');
    // serverTimestamp() can't be used directly in nested objects for set with merge.
    // We can handle timestamps specifically if needed, but for this CMS, it's not required.
    return contentRef.set(contentData, { merge: true });
};
