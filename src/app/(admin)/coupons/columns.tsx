"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Coupon } from "@/lib/types"
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
import { deleteCoupon, updateCoupon } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const CouponActions = ({ coupon }: { coupon: Coupon }) => {
    const { toast } = useToast();
    const router = useRouter();

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
                        <Link href={`/coupons/${coupon.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusToggle(coupon)}>
                        {coupon.isActive ? 'Deactivate' : 'Activate'}
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
    )
}

export const columns: ColumnDef<Coupon>[] = [
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
    accessorKey: "code",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Discount
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const discount = parseFloat(row.getValue("discount")) * 100
        return <div>{discount}%</div>
    }
  },
    {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
            <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-600 text-white' : ''}>
                {isActive ? 'Active' : 'Inactive'}
            </Badge>
        )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <CouponActions coupon={row.original} />,
  },
]
