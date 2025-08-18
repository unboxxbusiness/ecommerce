
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import type { Coupon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { deleteCoupon, updateCoupon } from '@/lib/firestore';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function CouponsClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = React.useState<Coupon[]>(initialCoupons);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  const handleDelete = async (couponId: string) => {
    try {
      await deleteCoupon(couponId);
      toast({ title: 'Coupon Deleted', description: 'The coupon has been successfully removed.' });
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete coupon.' });
    }
  };
  
  const handleStatusToggle = async (coupon: Coupon) => {
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      toast({ title: 'Status Updated', description: `Coupon is now ${!coupon.isActive ? 'active' : 'inactive'}.` });
      router.refresh();
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update coupon status.' });
    }
  };

  return (
    <>
      <Header title="Coupons">
         <Button size="sm" className="gap-1" asChild>
            <Link href="/coupons/new">
                <PlusCircle className="h-4 w-4" />
                Add Coupon
            </Link>
        </Button>
      </Header>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Promo Codes</CardTitle>
            <CardDescription>View and manage your promotional codes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date Created</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.discount * 100}%</TableCell>
                    <TableCell>
                        <Badge variant={coupon.isActive ? 'default' : 'secondary'} className={coupon.isActive ? 'bg-green-600 text-white' : ''}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(coupon.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/coupons/${coupon.id}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusToggle(coupon)}>
                                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
                                            Delete
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the coupon.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(coupon.id)} className="bg-destructive hover:bg-destructive/90">
                                            Delete
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
