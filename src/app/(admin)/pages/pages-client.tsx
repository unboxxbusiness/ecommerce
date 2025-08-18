
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Page } from '@/lib/types';
import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Table } from '@tanstack/react-table';
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
import { useToast } from '@/hooks/use-toast';
import { handleDeletePage } from '@/app/actions';
import { useRouter } from 'next/navigation';

const BulkDeleteButton = ({ table }: { table: Table<Page> }) => {
    const { toast } = useToast();
    const router = useRouter();
    
    const handleDelete = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        try {
            await Promise.all(selectedRows.map(row => handleDeletePage(row.original.id)));
            toast({ title: `${selectedRows.length} Pages Deleted`, description: 'The selected pages have been removed.' });
            table.resetRowSelection();
            router.refresh();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete pages.' });
        }
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the selected pages.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}

export function PagesClient({ initialPages }: { initialPages: Page[] }) {
  const [pages, setPages] = React.useState<Page[]>(initialPages);

  React.useEffect(() => {
    setPages(initialPages);
  }, [initialPages]);

  return (
    <>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Pages</h2>
            <Button size="sm" className="gap-1" asChild>
                <Link href="/pages/new">
                    <PlusCircle className="h-4 w-4" />
                    Add Page
                </Link>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Content Pages</CardTitle>
            <CardDescription>Manage your informational pages like About Us, Terms, etc.</CardDescription>
          </CardHeader>
          <CardContent>
             <DataTable 
                columns={columns}
                data={pages}
                filterColumnId="title"
                filterPlaceholder="Filter by title..."
                bulkActions={(table) => <BulkDeleteButton table={table} />}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
