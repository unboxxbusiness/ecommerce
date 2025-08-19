
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { useCartDrawer } from '@/hooks/use-cart-drawer';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/account', label: 'Account', icon: User },
]

export function MobileDock() {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { setIsCartDrawerOpen } = useCartDrawer();

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsCartDrawerOpen(true);
    }

    return(
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-t border-border z-50 md:hidden">
            <nav className="h-full">
                <ul className="h-full grid grid-cols-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href && item.href !== '/cart';
                        const isCart = item.href === '/cart';
                        const Icon = item.icon;
                        
                        const linkContent = (
                             <div className={cn(
                                "flex flex-col items-center justify-center h-full w-full gap-1 text-sm transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}>
                                <div className="relative">
                                    <Icon className="size-6" />
                                    {isCart && cartCount > 0 && (
                                        <Badge className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                                            {cartCount}
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-xs">{item.label}</span>
                            </div>
                        );

                        return (
                            <li key={item.href} className="h-full">
                                {isCart ? (
                                    <button onClick={handleCartClick} className="h-full w-full">
                                        {linkContent}
                                    </button>
                                ) : (
                                    <Link href={item.href}>
                                        {linkContent}
                                    </Link>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </div>
    )
}
