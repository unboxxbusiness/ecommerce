
import * as React from 'react';
import { SettingsClient } from './settings-client';

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <SettingsClient />
      </main>
    </div>
  );
}
