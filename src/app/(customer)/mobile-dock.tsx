
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { useCartDrawer } from '@/hooks/use-cart-drawer';
import { Dock, DockIcon } from '@/components/ui/dock';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/account', label: 'Account', icon: User },
]

export function MobileDock() {
    const pathname = usePathname();
    const { cartCount } = useCart();
    const { setIsCartDrawerOpen } = useCartDrawer();

    const handleCartClick = () => {
        setIsCartDrawerOpen(true);
    }

    return(
        <div className="fixed inset-x-0 bottom-4 z-50 md:hidden">
            <Dock>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const isCart = item.href === '/cart';
                    const Icon = item.icon;
                    
                    const iconContent = (
                        <div className="relative flex flex-col items-center justify-center text-center">
                            <Icon className={cn("size-6 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                             {isCart && cartCount > 0 && (
                                <Badge className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-xs">
                                    {cartCount}
                                </Badge>
                            )}
                        </div>
                    );

                    return (
                        <DockIcon key={item.href} onClick={isCart ? handleCartClick : undefined}>
                            {isCart ? (
                                <div className="w-full h-full flex items-center justify-center group">
                                  {iconContent}
                                </div>
                            ) : (
                                <Link href={item.href} className="w-full h-full flex items-center justify-center group">
                                   {iconContent}
                                </Link>
                            )}
                        </DockIcon>
                    )
                })}
            </Dock>
        </div>
    )
}
