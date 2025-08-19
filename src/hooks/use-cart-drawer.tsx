
'use client';

import React, { createContext, useContext, Dispatch, SetStateAction } from 'react';

interface CartDrawerContextType {
    isCartDrawerOpen: boolean;
    setIsCartDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined);

export const useCartDrawer = () => {
    const context = useContext(CartDrawerContext);
    if (context === undefined) {
        throw new Error('useCartDrawer must be used within a CartDrawerProvider');
    }
    return context;
};
