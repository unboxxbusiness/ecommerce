
import * as React from 'react';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileManagementForm } from './profile-management-form';
import { ThemeToggle } from './theme-toggle';
import { PaymentSettingsForm } from './payment-settings-form';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Settings" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="theme">Appearance</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>
                  Update your account information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileManagementForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="theme">
             <Card>
              <CardHeader>
                <CardTitle>Theme Management</CardTitle>
                <CardDescription>
                  Choose how you want the dashboard to look.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeToggle />
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="payments">
             <Card>
              <CardHeader>
                <CardTitle>Payment Gateway</CardTitle>
                <CardDescription>
                  Configure your payment provider settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentSettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
