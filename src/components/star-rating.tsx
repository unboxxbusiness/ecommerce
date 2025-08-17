'use client';

import { Star } from 'lucide-react';

export function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-5 w-5 ${
          i <= rating ? 'fill-primary text-primary' : 'fill-muted stroke-muted-foreground'
        }`}
      />
    );
  }
  return <>{stars}</>;
}
