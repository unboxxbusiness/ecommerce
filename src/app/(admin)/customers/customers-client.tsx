
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Download } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { deleteCustomer, updateCustomer } from '@/lib/firestore';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Papa from 'papaparse';

export function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  const handleDelete = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      toast({ title: 'Customer Deleted', description: 'The customer has been successfully removed.' });
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete customer.' });
    }
  };

  const getRoleVariant = (role: Customer['role']) => {
    switch (role) {
        case 'admin':
            return 'destructive';
        case 'manager':
            return 'default';
        case 'delivery partner':
            return 'secondary';
        default:
            return 'outline';
    }
  }

  const handleExport = () => {
    const dataToExport = customers.map(customer => ({
        'Customer ID': customer.id,
        'Name': customer.name,
        'Email': customer.email,
        'Role': customer.role,
        'Status': customer.isActive ? 'Active' : 'Inactive',
        'Join Date': new Date(customer.joinDate).toLocaleDateString(),
        'Total Orders': customer.totalOrders,
        'Total Spent (INR)': customer.totalSpent.toFixed(2),
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: 'Export Complete', description: 'Your customers have been downloaded as a CSV file.' });
  };

  return (
    <>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
                <Button size="sm" className="gap-1" asChild>
                    <Link href="/customers/new">
                        <PlusCircle className="h-4 w-4" />
                        Add Customer
                    </Link>
                </Button>
            </div>
        </div>
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
                  <TableHead>Role</TableHead>
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
                        <Badge variant={getRoleVariant(customer.role)} className="capitalize">
                            {customer.role}
                        </Badge>
                    </TableCell>
                     <TableCell>
                        <Switch
                            checked={customer.isActive}
                            onCheckedChange={async (checked) => {
                                await updateCustomer(customer.id, { isActive: checked });
                                router.refresh();
                            }}
                        />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell">{customer.totalOrders}</TableCell>
                    <TableCell className="text-right font-semibold">₹{customer.totalSpent.toFixed(2)}</TableCell>
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
                                  <Link href={`/customers/${customer.id}/edit`}>Edit</Link>
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
    </>
  );
}
