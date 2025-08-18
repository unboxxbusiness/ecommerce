
'use client';

import * as React from 'react';
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
import { EnvironmentSetup } from './environment-setup';
import { PaymentSettingsForm } from './payment-settings-form';

export function SettingsClient() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full max-w-lg grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="theme">Appearance</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="setup">Setup</TabsTrigger>
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
              Configure your payment settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentSettingsForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="setup">
        <Card>
          <CardHeader>
            <CardTitle>Environment Setup</CardTitle>
            <CardDescription>
              Configure all necessary environment variables for your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnvironmentSetup />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
