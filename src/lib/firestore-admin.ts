

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

export const createProduct = async (productData: Omit<Product, 'id' | 'rating' | 'popularity' | 'reviews' | 'variants'>) => {
    const newProductData = {
        ...productData,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating between 3.0 and 5.0
        popularity: Math.floor(Math.random() * 1000),
        reviews: [],
        variants: [],
    };
    const docRef = await adminDb.collection('products').add(newProductData);
    return docRef.id;
};

export const updateProduct = (id: string, productData: Partial<Product>) => {
    const productRef = adminDb.collection('products').doc(id);
    return productRef.update(productData);
};

export const deleteProduct = (id: string) => {
    return adminDb.collection('products').doc(id).delete();
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
             if (docData) {
                for (const key in docData) {
                    if (docData[key] instanceof Timestamp) {
                        docData[key] = (docData[key] as Timestamp).toDate().toISOString();
                    }
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

export const updateCoupon = (id: string, couponData: Partial<Coupon>) => {
    if (couponData.code) {
        couponData.code = couponData.code.toUpperCase();
    }
    const couponRef = adminDb.collection('coupons').doc(id);
    return couponRef.update(couponData);
};

export const deleteCoupon = (id: string) => {
    return adminDb.collection('coupons').doc(id).delete();
};

// Site Content functions
const defaultSiteContent: SiteContent = {
  header: {
    siteName: 'Digital Shop',
    logoUrl: 'https://placehold.co/40x40.png', 
    iconName: 'Gem',
  },
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
  homePage: {
    hero: {
      show: true,
      badge: 'Design Collective',
      title1: 'Elevate Your Digital Vision',
      title2: 'Crafting Exceptional Websites',
      subtitle: "Crafting exceptional digital experiences through innovative design and cutting-edge technology.",
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
      await docRef.set(defaultSiteContent);
      return defaultSiteContent;
    }
    
    const data = docSnap.data() as Partial<SiteContent>;
    
    // Deep merge for nested objects
    const homePage = {
        hero: { ...defaultSiteContent.homePage.hero, ...data.homePage?.hero },
        testimonials: { ...defaultSiteContent.homePage.testimonials, ...data.homePage?.testimonials },
        ctaBlock: { ...defaultSiteContent.homePage.ctaBlock, ...data.homePage?.ctaBlock },
    };

    return {
        header: { ...defaultSiteContent.header, ...data.header },
        footer: { ...defaultSiteContent.footer, ...data.footer },
        homePage: homePage
    };

  } catch (error) {
    console.error('Failed to fetch site content:', error);
    return defaultSiteContent;
  }
};


export const updateSiteContent = (contentData: Partial<SiteContent>) => {
    const contentRef = adminDb.collection('siteContent').doc('main');
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

        // Convert Firestore Timestamps to serializable strings
        for (const key in pageData) {
            if (pageData[key] instanceof Timestamp) {
                pageData[key] = (pageData[key] as Timestamp).toDate().toISOString();
            }
        }

        return { id: pageDoc.id, ...pageData } as Page;
    } catch (error) {
        console.error(`Failed to fetch page by slug ${slug}:`, error);
        return null;
    }
};


export const deletePage = (id: string) => {
    return adminDb.collection('pages').doc(id).delete();
}
