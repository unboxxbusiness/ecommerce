
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
import { PlusCircle } from 'lucide-react';
import { getAdminCustomers } from '@/lib/firestore-admin';
import type { Customer } from '@/lib/types';

export default async function CustomersPage() {
    const customers: Customer[] = await getAdminCustomers();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Customers">
         <Button size="sm" className="gap-1">
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
                    <TableHead className="hidden sm:table-cell">Join Date</TableHead>
                    <TableHead className="hidden md:table-cell">Total Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
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
                        <TableCell className="hidden sm:table-cell">{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden md:table-cell">{customer.totalOrders}</TableCell>
                        <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
