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
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
};
