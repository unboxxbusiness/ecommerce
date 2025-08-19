
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Gem, Loader2, ArrowLeft, type LucideIcon, icons } from 'lucide-react';
import { handlePasswordReset } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { SiteContent } from '@/lib/types';


const DynamicIcon = ({ name }: { name?: string }) => {
  const IconComponent = (icons as Record<string, LucideIcon>)[name || 'Gem'];

  if (!IconComponent) {
    return <Gem className="size-5" />;
  }

  return <IconComponent className="size-5" />;
};


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  
  useEffect(() => {
    fetch('/api/content').then(res => res.json()).then(setSiteContent);
  }, []);


  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address.',
      });
      return;
    }

    setIsSending(true);
    try {
      const result = await handlePasswordReset(email);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Request Failed',
          description: result.error,
        });
      } else {
        setIsSent(true);
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
             {siteContent && (
                <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-90">
                    <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary">
                        <DynamicIcon name={siteContent.header.iconName} />
                    </Button>
                    <span className="font-headline text-lg font-semibold">{siteContent.header.siteName}</span>
                </Link>
             )}
        </div>
        <Card>
          {isSent ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <CardDescription>
                  If an account exists for <strong>{email}</strong>, a password reset link has been sent to it. Please check your inbox and spam folder.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Forgot Password</CardTitle>
                <CardDescription>
                  Enter your email and we&apos;ll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetRequest} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSending}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSending}>
                    {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  Remember your password?{' '}
                  <Link href="/login" className="underline">
                    Login
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
