'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send, Link as LinkIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

// WhatsApp icon as an inline SVG component
const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);


type ShareButtonsProps = {
  productName: string;
};

export function ShareButtons({ productName }: ShareButtonsProps) {
  const { toast } = useToast();
  const pathname = usePathname();
  const [productUrl, setProductUrl] = React.useState('');

  React.useEffect(() => {
    // Ensure this runs only on the client where window is available
    setProductUrl(window.location.href);
  }, [pathname]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    toast({
      title: 'Link Copied!',
      description: 'The product link has been copied to your clipboard.',
    });
  };
  
  const shareText = `Check out this product: ${productName}`;

  if (!productUrl) return null; // Don't render until URL is available on client

  return (
    <div className="flex items-center gap-2">
       <p className="text-sm font-medium mr-2">Share:</p>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${shareText} - ${productUrl}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
      >
        <Button variant="outline" size="icon">
          <WhatsAppIcon />
        </Button>
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Telegram"
      >
        <Button variant="outline" size="icon">
          <Send />
        </Button>
      </a>
      <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy link">
        <LinkIcon />
      </Button>
    </div>
  );
}
