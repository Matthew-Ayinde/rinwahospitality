'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type MediaType = 'image' | 'video';

type EventMedia = {
  _id: string;
  imageUrl: string;
  mediaType?: MediaType;
  posterUrl?: string;
  caption?: string;
  order?: number;
  isActive?: boolean;
};

type FeaturedEvent = {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  date: string;
  time: string;
  media: EventMedia[];
  isActive: boolean;
};

export default function FeaturedEventRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/featured-events');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-white/60">Redirecting to Featured Events...</p>
    </div>
  );
}
