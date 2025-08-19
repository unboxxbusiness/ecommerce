
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
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gem, Eye, EyeOff, Loader2 } from 'lucide-react';
import { handlePasswordReset } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await login(email, password);
      if (userCredential.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
         router.push('/dashboard');
      } else {
         router.push('/account');
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    }
  };
  
  const onPasswordReset = async () => {
    if (!email) {
        toast({
            variant: 'destructive',
            title: 'Email Required',
            description: 'Please enter your email address to reset your password.',
        });
        return;
    }
    setIsSendingReset(true);
    try {
        const result = await handlePasswordReset(email);
        if (result.error) {
             toast({
                variant: 'destructive',
                title: 'Request Failed',
                description: result.error,
            });
        } else {
            toast({
                title: 'Password Reset Email Sent',
                description: 'Check your inbox (and spam folder) to reset your password.',
            });
        }
    } catch(err) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'An unexpected error occurred. Please try again.',
        });
    } finally {
        setIsSendingReset(false);
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary">
                    <Gem className="size-5" />
                 </Button>
                <span className="font-headline text-lg font-semibold">Digital Shop</span>
            </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                   <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto text-sm"
                      onClick={onPasswordReset}
                      disabled={isSendingReset}
                    >
                      {isSendingReset ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                      Forgot password?
                    </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
