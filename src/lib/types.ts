
export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
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
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
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
};
