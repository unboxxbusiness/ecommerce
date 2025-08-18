
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { getAdminCustomers } from '@/lib/firestore-admin';
import type { Customer } from '@/lib/types';
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
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { deleteCustomer, updateCustomer, createCustomer } from '@/lib/firestore';

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchCustomers = React.useCallback(async () => {
    setLoading(true);
    try {
      // This is a client component, so we need a way to call server functions.
      // For this example, we'll create a temporary server action-like fetcher.
      const customersData = await (async () => {
        // This is a workaround. Ideally this would be a proper Server Action.
        const res = await fetch('/api/get-customers');
        if(!res.ok) throw new Error("Failed to fetch");
        return await res.json();
      })();
      setCustomers(customersData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load customers.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const initialFetch = async () => {
        setLoading(true);
        const initialCustomers = await getAdminCustomers();
        setCustomers(initialCustomers);
        setLoading(false);
    }
    initialFetch();
  }, []);

  const handleDelete = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      toast({ title: 'Customer Deleted', description: 'The customer has been successfully removed.' });
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete customer.' });
    }
  };

  const handleEditOpen = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };
  
  const handleSave = async (formData: FormData) => {
    if (!selectedCustomer && !isNewCustomer) return;

    const updatedData: Partial<Customer> = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        isActive: formData.get('isActive') === 'on',
    };

    try {
        if (isNewCustomer) {
            await createCustomer(updatedData as any);
             toast({ title: 'Customer Created', description: 'New customer has been added.' });
        } else if (selectedCustomer) {
            await updateCustomer(selectedCustomer.id, updatedData);
            toast({ title: 'Customer Updated', description: 'Customer details have been saved.' });
        }
        router.refresh();
        setIsEditDialogOpen(false);
        setSelectedCustomer(null);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save customer.' });
    }
  };
  
  const [isNewCustomer, setIsNewCustomer] = React.useState(false);

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsNewCustomer(true);
    setIsEditDialogOpen(true);
  };

  const CustomerForm = ({ customer, onSave, onCancel }: { customer: Customer | null, onSave: (data: FormData) => void, onCancel: () => void }) => (
    <form action={onSave}>
        <DialogHeader>
            <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
                {customer ? "Update the customer's details below." : "Fill in the details to create a new customer."}
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" defaultValue={customer?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={customer?.email} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">Active</Label>
                 <Switch id="isActive" name="isActive" defaultChecked={customer?.isActive ?? true} />
            </div>
        </div>
        <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </DialogFooter>
    </form>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Customers">
         <Button size="sm" className="gap-1" onClick={handleAddNew}>
          <PlusCircle className="h-4 w-4" />
          Add Customer
        </Button>
      </Header>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Customer Profiles</CardTitle>
            <CardDescription>View and manage your customer data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Join Date</TableHead>
                  <TableHead className="hidden md:table-cell">Total Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={customer.avatar} alt="Avatar" data-ai-hint="person avatar" />
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                     <TableCell>
                        <Switch
                            checked={customer.isActive}
                            onCheckedChange={(checked) => updateCustomer(customer.id, { isActive: checked })}
                        />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell">{customer.totalOrders}</TableCell>
                    <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
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
                                <DropdownMenuItem onSelect={() => handleEditOpen(customer)}>Edit</DropdownMenuItem>
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
                                            This action cannot be undone. This will permanently delete the customer.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(customer.id)} className="bg-destructive hover:bg-destructive/90">
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
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
              setIsEditDialogOpen(false);
              setSelectedCustomer(null);
              setIsNewCustomer(false);
          }
      }}>
        <DialogContent>
            <CustomerForm 
                customer={selectedCustomer}
                onSave={handleSave}
                onCancel={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCustomer(null);
                    setIsNewCustomer(false);
                }}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
