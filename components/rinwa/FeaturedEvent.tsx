"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type EventMedia = {
  _id: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  posterUrl?: string;
  caption?: string;
  order?: number;
  isActive?: boolean;
};

type FeaturedEventData = {
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

/**
 * Editorial featured block.
 * A subtle parallax lift keeps the event feeling immersive without becoming distracting.
 * Now fetches from API with fallback to defaults.
 */
export function FeaturedEvent() {
  const shouldReduceMotion = useReducedMotion();
  
  const [event, setEvent] = useState<FeaturedEventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch('/api/featured-event');
        if (res.ok) {
          const data = await res.json();
          if (data.isActive) {
            setEvent(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch featured event:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, []);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Show nothing if no active event
  if (!event) {
    return null;
  }

  // Get background image/video from first media item
  const backgroundMedia = event.media?.[0];
  const backgroundSrc = backgroundMedia?.imageUrl || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=80";

  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { scale: 1.06 }}
            animate={shouldReduceMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {backgroundMedia?.mediaType === 'video' ? (
              <video
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={backgroundMedia?.posterUrl || backgroundSrc}
              >
                <source src={backgroundSrc} />
              </video>
            ) : (
              <Image
                src={backgroundSrc}
                alt={event.subtitle}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            )}
          </motion.div>

          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,17,20,0.94)_10%,rgba(4,17,20,0.52)_55%,rgba(4,17,20,0.84)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,207,0.12),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(15,118,110,0.18),transparent_26%)]" />

          <div className="relative grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">Featured event</p>
              <h2 className="mt-4 font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] tracking-tighter text-white">
                {event.title}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/74">
                {event.description}
              </p>

              <div className="mt-8 grid gap-4 text-white/82 sm:grid-cols-3">
                {[
                  ["Location", event.location],
                  ["Date", event.date],
                  ["Time", event.time],
                ].map(([label, value]) => (
                  value && (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-md">
                      <p className="text-xs uppercase tracking-[0.28em] text-teal-100/68">{label}</p>
                      <p className="mt-2 text-base text-white/90">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="flex items-end justify-start lg:justify-end">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full max-w-sm rounded-4xl border border-white/12 bg-[#041114]/50 p-5 backdrop-blur-2xl"
              >
                <p className="text-sm uppercase tracking-[0.28em] text-teal-100/70">Next ritual</p>
                <p className="mt-4 font-serif text-3xl leading-tight text-white">
                  {event.subtitle}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button className="rounded-full bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-teal-200">
                    RSVP
                  </button>
                  <button className="rounded-full border border-white/16 bg-white/5 px-5 py-3 text-sm text-white/80 transition duration-300 hover:border-teal-300/40 hover:bg-white/10">
                    Relive the Moment
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
