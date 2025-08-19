

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id:string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  rating: number;
  popularity: number;
  variants: {
    type: string;
    options: string[];
  }[];
  reviews: Review[];
};

export type OrderItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Ready to Ship' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string; // Should be ISO string or server timestamp
  isActive: boolean;
  role: 'admin' | 'manager' | 'delivery partner' | 'customer';
  fcmTokens?: string[];
};

export type Coupon = {
  id: string;
  code: string;
  discount: number; // Stored as a decimal, e.g., 0.10 for 10%
  isActive: boolean;
  createdAt: string; // Should be ISO string or server timestamp
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  authorRole: string;
};

export type FooterSection = {
  title: string;
  links: { name: string; href: string }[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteContent = {
  header: {
    siteName: string;
    logoUrl: string;
    iconName?: string;
  };
  footer: {
      description: string;
      sections: FooterSection[];
      socialLinks: SocialLink[];
      legalLinks: { name: string; href: string }[];
  };
  homePage: {
    hero: {
      show: boolean;
      badge: string;
      title1: string;
      title2: string;
      subtitle: string;
    };
    testimonials: {
      show: boolean;
      title: string;
      items: Testimonial[];
    };
    ctaBlock: {
      show: boolean;
      title: string;
      subtitle: string;
      ctaText: string;
      ctaLink: string;
    };
  };
};

export type Page = {
    id: string;
    title: string;
    slug: string;
    content: string; // Stored as HTML
    isPublished: boolean;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}
