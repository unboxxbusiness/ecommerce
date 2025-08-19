
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-muted/30">
      <div
        className={cn(
          'p-1 rounded-lg transition-all duration-300',
          theme === 'light' ? 'bg-primary shadow-lg' : 'bg-transparent'
        )}
      >
        <button onClick={() => setTheme('light')} className="w-full focus:outline-none">
          <Card
            className={cn(
              'w-full transition-colors duration-200',
              theme === 'light'
                ? 'bg-background'
                : 'bg-card hover:bg-muted/50'
            )}
          >
            <div className="p-6 flex flex-col items-center justify-center gap-2">
              <Sun className="h-8 w-8" />
              <span className="font-semibold text-lg">Light Mode</span>
            </div>
          </Card>
        </button>
      </div>
      <div
        className={cn(
          'p-1 rounded-lg transition-all duration-300',
          theme === 'dark' ? 'bg-primary shadow-lg' : 'bg-transparent'
        )}
      >
        <button onClick={() => setTheme('dark')} className="w-full focus:outline-none">
          <Card
            className={cn(
              'w-full transition-colors duration-200',
              theme === 'dark'
                ? 'bg-background'
                : 'bg-card hover:bg-muted/50'
            )}
          >
            <div className="p-6 flex flex-col items-center justify-center gap-2">
              <Moon className="h-8 w-8" />
              <span className="font-semibold text-lg">Dark Mode</span>
            </div>
          </Card>
        </button>
      </div>
    </div>
  );
}
