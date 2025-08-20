
"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Customer } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog";
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { deleteCustomer, updateCustomer } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"

const CustomerActions = ({ customer }: { customer: Customer }) => {
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async (customerId: string) => {
        try {
        await deleteCustomer(customerId);
        toast({ title: 'Customer Deleted', description: 'The customer has been successfully removed.' });
        router.refresh();
        } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete customer.' });
        }
    };
    
    return (
        <AlertDialog>
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
                    <AlertDialogTrigger asChild>
                        <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
                            Delete
                        </button>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
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
    )
}

const getRoleVariant = (role: Customer['role']) => {
    switch (role) {
        case 'admin': return 'destructive';
        case 'manager': return 'default';
        case 'delivery partner': return 'secondary';
        default: return 'outline';
    }
}

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const customer = row.original;
      const fallbackInitial = (customer.name || customer.email || 'A').charAt(0);
      return (
        <div className="flex items-center gap-3">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src={customer.avatar} alt="Avatar" data-ai-hint="person avatar" />
            <AvatarFallback>{fallbackInitial}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <p className="font-medium">{customer.name || customer.email}</p>
            {customer.name && <p className="text-sm text-muted-foreground">{customer.email}</p>}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
        <Badge variant={getRoleVariant(row.original.role)} className="capitalize">
            {row.original.role}
        </Badge>
    )
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
        const router = useRouter();
        const customer = row.original;
        return (
            <Switch
                checked={customer.isActive}
                onCheckedChange={async (checked) => {
                    await updateCustomer(customer.id, { isActive: checked });
                    router.refresh();
                }}
            />
        )
    }
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Join Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => new Date(row.getValue("joinDate")).toLocaleDateString(),
  },
  {
    accessorKey: "totalOrders",
    header: () => <div className="text-right">Total Orders</div>,
    cell: ({ row }) => <div className="text-right">{row.getValue("totalOrders")}</div>,
  },
  {
    accessorKey: "totalSpent",
    header: ({ column }) => (
        <div className="text-right">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Total Spent
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalSpent"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomerActions customer={row.original} />,
  },
]
