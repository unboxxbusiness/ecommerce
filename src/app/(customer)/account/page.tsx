
'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold">My Account</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user?.photoURL ?? 'https://placehold.co/100x100.png'}
                data-ai-hint="user avatar"
              />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold">{user?.displayName}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            View your past orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have no orders yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
