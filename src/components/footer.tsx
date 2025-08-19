
'use client';

import React from 'react';
import type { SiteContent } from '@/lib/types';
import { Gem } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const socialIconMap: { [key: string]: React.ReactElement } = {
  Instagram: <FaInstagram className="size-5" />,
  Facebook: <FaFacebook className="size-5" />,
  Twitter: <FaTwitter className="size-5" />,
  LinkedIn: <FaLinkedin className="size-5" />,
};

export function Footer() {
    const [content, setContent] = React.useState<SiteContent | null>(null);

    React.useEffect(() => {
        fetch('/api/content')
            .then(res => res.json())
            .then(data => setContent(data));
    }, []);

  if (!content) {
    return null;
  }
  
  const { header, footer } = content;
  const currentYear = new Date().getFullYear();
  const copyright = `© ${currentYear} ${header.siteName}. All rights reserved.`;

  return (
    <footer className="bg-background border-t hidden md:block">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Gem className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-semibold">{header.siteName}</h2>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              {footer.description}
            </p>
            <ul className="flex items-center space-x-4 text-muted-foreground">
              {footer.socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-primary">
                  <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                    {socialIconMap[social.label] || social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
            {footer.sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t pt-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p className="order-2 md:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-4">
            {footer.legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <Link href={link.href}> {link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
