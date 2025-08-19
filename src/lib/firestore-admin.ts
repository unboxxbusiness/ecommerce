

'use server-only';

import { adminDb } from './firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import type { Product, Order, Customer, Coupon, SiteContent, Page } from './types';

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
    footer: {
      description: 'A collection of components for your startup business or side project.',
      sections: [
        {
          title: "Product",
          links: [
            { name: "Overview", href: "#" },
            { name: "Pricing", href: "#" },
            { name: "Marketplace", href: "#" },
            { name: "Features", href: "#" },
          ],
        },
        {
          title: "Company",
          links: [
            { name: "About", href: "/p/about-us" },
            { name: "Team", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Careers", href: "#" },
          ],
        },
        {
          title: "Resources",
          links: [
            { name: "Help", href: "#" },
            { name: "Sales", href: "#" },
            { name: "Advertise", href: "#" },
            { name: "Privacy", href: "/p/privacy-policy" },
          ],
        },
      ],
      socialLinks: [
        { label: "Instagram", href: "#" },
        { label: "Facebook", href: "#" },
        { label: "Twitter", href: "#" },
        { label: "LinkedIn", href: "#" },
      ],
      legalLinks: [
        { name: "Terms and Conditions", href: "/p/terms-of-service" },
        { name: "Privacy Policy", href: "/p/privacy-policy" },
      ],
    },
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
    const globalData = data.global || {};
    const homePageData = data.homePage || {};
    return {
        global: { 
            ...defaultSiteContent.global, 
            ...globalData,
            footer: {
                ...defaultSiteContent.global.footer,
                ...(globalData.footer || {}),
            }
        },
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

// Page functions for admin
export const getAdminPages = () => fetchCollection<Page>('pages');

export const getAdminPage = async (id: string): Promise<Page | null> => {
    try {
        const docRef = adminDb.collection('pages').doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const docData = docSnap.data();
             for (const key in docData) {
                if (docData[key] instanceof Timestamp) {
                    docData[key] = (docData[key] as Timestamp).toDate().toISOString();
                }
            }
            return { id: docSnap.id, ...docData } as Page;
        }
        return null;
    } catch(error) {
        console.error(`Failed to fetch page ${id}:`, error);
        return null;
    }
}

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
    try {
        const q = adminDb.collection('pages')
            .where('slug', '==', slug)
            .limit(1);

        const querySnapshot = await q.get();
        if (querySnapshot.empty) {
            return null;
        }
        const pageDoc = querySnapshot.docs[0];
        const pageData = pageDoc.data();
        if (!pageData) return null;

        // Convert timestamps correctly
        const createdAt = pageData.createdAt instanceof Timestamp 
            ? pageData.createdAt.toDate().toISOString() 
            : new Date().toISOString();
        const updatedAt = pageData.updatedAt instanceof Timestamp 
            ? pageData.updatedAt.toDate().toISOString() 
            : new Date().toISOString();

        return { id: pageDoc.id, ...pageData, createdAt, updatedAt } as Page;
    } catch (error) {
        console.error(`Failed to fetch page by slug ${slug}:`, error);
        return null;
    }
};


export const deletePage = (id: string) => {
    return adminDb.collection('pages').doc(id).delete();
}
