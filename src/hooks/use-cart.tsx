
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, Coupon } from '@/lib/types';
import { getActiveCouponByCode } from '@/lib/firestore';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  couponApplied: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    // In a real app, you would persist and load cart from localStorage
    const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const newDiscount = coupon ? newSubtotal * coupon.discount : 0;
    
    setSubtotal(newSubtotal);
    setCartCount(newCartCount);
    setDiscount(newDiscount);
    setTotal(newSubtotal - newDiscount);

  }, [cartItems, coupon]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    const foundCoupon = await getActiveCouponByCode(couponCode);
    if (foundCoupon) {
      setCoupon(foundCoupon);
      return true;
    }
    setCoupon(null);
    return false;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    cartCount,
    subtotal,
    discount,
    total,
    couponApplied: coupon?.code || null,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
