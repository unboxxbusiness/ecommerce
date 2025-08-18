
import * as React from 'react';
import { Header } from '@/components/header';
import { SettingsClient } from './settings-client';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Settings" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <SettingsClient />
      </main>
    </div>
  );
}
