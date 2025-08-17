
import type { Product, Order, Customer, Review } from './types';

const sampleReviews: Review[] = [
    { id: 'rev_001', author: 'Sophie R.', rating: 5, comment: "Absolutely love this mug! The quality is outstanding and the color is beautiful. It's my new favorite.", date: '2024-07-15' },
    { id: 'rev_002', author: 'Liam G.', rating: 4, comment: "Great mug, feels very sturdy. I wish it was a little bigger, but overall I'm very happy with it.", date: '2024-07-12' },
    { id: 'rev_003', author: 'Emma C.', rating: 5, comment: "The perfect tote bag! It's so spacious and the organic cotton feels amazing. The print is lovely.", date: '2024-07-20' },
    { id: 'rev_004', author: 'Noah T.', rating: 5, comment: "I use this bag for everything. Groceries, gym, you name it. It's held up incredibly well.", date: '2024-07-18' },
    { id: 'rev_005', author: 'Ava M.', rating: 5, comment: "This candle smells divine. It fills the whole room with a beautiful, relaxing scent. Will be buying more!", date: '2024-07-22' },
];

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Artisan Ceramic Mug',
    description: 'A beautifully handcrafted ceramic mug, perfect for your morning coffee or tea. Each mug is unique, with slight variations in color and texture that add to its charm. It features a comfortable handle and a smooth, glossy finish that is a pleasure to hold. Dishwasher and microwave safe.',
    price: 25.0,
    stock: 42,
    image: 'https://placehold.co/600x600.png',
    category: 'Kitchen',
    rating: 4.8,
    popularity: 85,
    variants: [{ type: 'Color', options: ['Seafoam Green', 'Terracotta', 'Midnight Blue'] }],
    reviews: [sampleReviews[0], sampleReviews[1]],
  },
  {
    id: 'prod_002',
    name: 'Organic Cotton Tote Bag',
    description: 'Eco-friendly and stylish, this tote bag is made from 100% organic cotton. It\'s durable and spacious enough for your groceries, books, or beach essentials. Reinforced stitching on the handles ensures it can carry a heavy load, and the wide opening makes it easy to pack and unpack.',
    price: 18.5,
    stock: 150,
    image: 'https://placehold.co/600x600.png',
    category: 'Apparel',
    rating: 4.5,
    popularity: 95,
    variants: [{ type: 'Design', options: ['Leaf Print', 'Geometric', 'Solid Natural'] }],
    reviews: [sampleReviews[2], sampleReviews[3]],
  },
  {
    id: 'prod_003',
    name: 'Hand-poured Soy Candle',
    description: 'Scented soy candle in a reusable glass jar. Made with natural soy wax and essential oils, providing a clean, long-lasting burn of up to 50 hours. Choose from our signature scents to create a warm and inviting atmosphere in any room. The wooden wick provides a gentle crackling sound.',
    price: 32.0,
    stock: 78,
    image: 'https://placehold.co/600x600.png',
    category: 'Home Goods',
    rating: 4.9,
    popularity: 92,
    variants: [{ type: 'Scent', options: ['Lavender & Sage', 'Sandalwood & Vanilla', 'Citrus & Basil'] }],
    reviews: [sampleReviews[4]],
  },
  {
    id: 'prod_004',
    name: 'Minimalist Wall Calendar',
    description: 'Stay organized with this sleek and minimalist 2024 wall calendar. Features a clean design with plenty of space for notes and appointments. Printed on high-quality, thick paper stock that prevents ink bleed-through. The wire-o binding allows it to hang flat against the wall.',
    price: 22.0,
    stock: 30,
    image: 'https://placehold.co/600x600.png',
    category: 'Stationery',
    rating: 4.7,
    popularity: 70,
    variants: [],
    reviews: [],
  },
  {
    id: 'prod_005',
    name: 'Reusable Beeswax Wraps',
    description: 'A sustainable alternative to plastic wrap. This set of 3 beeswax wraps is perfect for covering bowls, wrapping sandwiches, or storing snacks. Made from organic cotton infused with beeswax, jojoba oil, and tree resin. Simply wash with cool water and soap and reuse for up to a year.',
    price: 15.0,
    stock: 0,
    image: 'https://placehold.co/600x600.png',
    category: 'Kitchen',
    rating: 4.6,
    popularity: 88,
    variants: [{ type: 'Pattern', options: ['Honeycomb', 'Floral', 'Botanical'] }],
    reviews: [],
  },
];

export const orders: Order[] = [
  { id: 'ORD-240728A', customerName: 'Alice Johnson', customerEmail: 'alice.j@example.com', date: '2024-07-28', status: 'Delivered', total: 57.00, items: 2 },
  { id: 'ORD-240728B', customerName: 'Bob Williams', customerEmail: 'bob.w@example.com', date: '2024-07-28', status: 'Shipped', total: 32.00, items: 1 },
  { id: 'ORD-240727A', customerName: 'Charlie Brown', customerEmail: 'charlie.b@example.com', date: '2024-07-27', status: 'Pending', total: 18.50, items: 1 },
  { id: 'ORD-240726A', customerName: 'Diana Prince', customerEmail: 'diana.p@example.com', date: '2024-07-26', status: 'Delivered', total: 43.50, items: 2 },
  { id: 'ORD-240726B', customerName: 'Ethan Hunt', customerEmail: 'ethan.h@example.com', date: '2024-07-26', status: 'Cancelled', total: 25.00, items: 1 },
  { id: 'ORD-240725A', customerName: 'Fiona Glenanne', customerEmail: 'fiona.g@example.com', date: '2024-07-25', status: 'Shipped', total: 15.00, items: 1 },
];

export const customers: Customer[] = [
    { id: 'cust_001', name: 'Alice Johnson', email: 'alice.j@example.com', avatar: 'https://placehold.co/100x100.png', totalOrders: 5, totalSpent: 289.50, joinDate: '2023-01-15' },
    { id: 'cust_002', name: 'Bob Williams', email: 'bob.w@example.com', avatar: 'https://placehold.co/100x100.png', totalOrders: 2, totalSpent: 75.00, joinDate: '2023-05-20' },
    { id: 'cust_003', name: 'Charlie Brown', email: 'charlie.b@example.com', avatar: 'https://placehold.co/100x100.png', totalOrders: 8, totalSpent: 412.75, joinDate: '2022-11-10' },
    { id: 'cust_004', name: 'Diana Prince', email: 'diana.p@example.com', avatar: 'https://placehold.co/100x100.png', totalOrders: 3, totalSpent: 150.25, joinDate: '2023-08-01' },
    { id: 'cust_005', name: 'Ethan Hunt', email: 'ethan.h@example.com', avatar: 'https://placehold.co/100x100.png', totalOrders: 1, totalSpent: 22.00, joinDate: '2024-02-18' },
];
