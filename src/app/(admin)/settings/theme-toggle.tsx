
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button onClick={() => setTheme('light')} className="focus:outline-none">
        <Card
          className={`w-full ${
            theme === 'light' ? 'border-primary ring-2 ring-primary' : ''
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" /> Light Mode
            </CardTitle>
            <CardDescription>A bright, clean interface.</CardDescription>
          </CardHeader>
        </Card>
      </button>
      <button onClick={() => setTheme('dark')} className="focus:outline-none">
        <Card
          className={`w-full ${
            theme === 'dark' ? 'border-primary ring-2 ring-primary' : ''
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" /> Dark Mode
            </CardTitle>
            <CardDescription>A sleek, dark interface.</CardDescription>
          </CardHeader>
        </Card>
      </button>
    </div>
  );
}
