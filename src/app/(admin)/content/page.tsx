
import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSiteContent } from '@/lib/firestore-admin';
import { HeaderContentForm } from './header-content-form';
import { HomePageContentForm } from './homepage-content-form';
import { FooterContentForm } from './footer-content-form';

export default async function ContentPage() {
  const siteContent = await getSiteContent();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="homepage">Home Page</TabsTrigger>
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>
          <TabsContent value="homepage">
            <Card>
              <CardHeader>
                <CardTitle>Home Page Content</CardTitle>
                <CardDescription>
                  Manage the sections displayed on your public-facing home page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HomePageContentForm content={siteContent.homePage} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="header">
             <Card>
              <CardHeader>
                <CardTitle>Header Content</CardTitle>
                <CardDescription>
                  Manage your site-wide brand name and logo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeaderContentForm content={siteContent.header} />
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="footer">
             <Card>
              <CardHeader>
                <CardTitle>Footer Content</CardTitle>
                <CardDescription>
                  Manage the content and links in your site's footer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FooterContentForm content={siteContent.footer} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
