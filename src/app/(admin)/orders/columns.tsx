"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Order } from "@/lib/types"
import { MoreHorizontal, ArrowUpDown, Ship } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { updateOrderStatus } from "@/lib/firestore"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const OrderActions = ({ order }: { order: Order }) => {
    const router = useRouter();
    const { toast } = useToast();
    const statusOptions: Order['status'][] = ['Pending', 'Ready to Ship', 'Shipped', 'Delivered', 'Cancelled'];

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            toast({
                title: "Order Status Updated",
                description: `Order has been marked as ${newStatus}.`,
            });
             router.refresh();
        } catch (error) {
            console.error("Failed to update order status:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update order status. Please try again.",
            });
        }
    };
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {order.status === 'Pending' && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Ready to Ship')}>
                        <Ship className="mr-2 h-4 w-4" />
                        Create Shipment
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                {statusOptions.map(status => (
                    <DropdownMenuItem 
                        key={status} 
                        disabled={order.status === status}
                        onClick={() => handleStatusUpdate(order.id, status)}
                    >
                        Mark as {status}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "customerName",
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
        const order = row.original;
        return (
             <div>
                <div className="font-medium">{order.customerName}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                    {order.customerEmail}
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as Order['status'];
        const getStatusVariant = (status: Order['status']) => {
            switch(status) {
                case 'Delivered': return 'default';
                case 'Shipped': return 'secondary';
                case 'Ready to Ship': return 'secondary';
                case 'Cancelled': return 'destructive';
                case 'Pending':
                default: return 'outline';
            }
        }
        const getStatusClass = (status: Order['status']) => {
            switch(status) {
                case 'Delivered': return 'bg-green-600 text-white';
                case 'Ready to Ship': return 'bg-blue-500 text-white';
                default: return '';
            }
        }
      return (
            <Badge variant={getStatusVariant(status)} className={getStatusClass(status)}>
                {status}
            </Badge>
      )
    },
  },
    {
    accessorKey: "items",
    header: () => <div className="text-right">Items</div>,
    cell: ({ row }) => {
        const items = row.getValue("items") as Order['items'];
        return <div className="text-right">{items.reduce((acc, item) => acc + item.quantity, 0)}</div>
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
        <div className="text-right">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Total
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
]
