
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { CardFooter } from '@/components/ui/card';
import { handlePasswordReset } from '@/app/actions';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
});

export function ProfileManagementForm() {
  const { toast } = useToast();
  const { user, updateUserProfile, loading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsSaving(true);
    try {
      await updateUserProfile({
          displayName: values.displayName,
          email: values.email
      });
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'There was an error updating your profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const onPasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    try {
        const result = await handlePasswordReset(user.email);
        if (result.error) {
             toast({
                variant: 'destructive',
                title: 'Request Failed',
                description: result.error,
            });
        } else {
            toast({
                title: 'Password Reset Email Sent',
                description: 'Please check your inbox to reset your password.',
            });
        }
    } catch(err) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'An unexpected error occurred.',
        });
    } finally {
        setIsSendingReset(false);
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g. jane.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="px-0">
            <div className="flex justify-end gap-2 w-full">
                <Button type="submit" disabled={isSaving || loading}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </CardFooter>
      </form>
    </Form>
     <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-medium">Password Management</h3>
        <p className="text-sm text-muted-foreground mt-1">
            Click the button below to receive a password reset link to your email.
        </p>
        <Button
            variant="outline"
            className="mt-4"
            onClick={onPasswordReset}
            disabled={isSendingReset}
            >
            {isSendingReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Password Reset Email
        </Button>
     </div>
    </>
  );
}
