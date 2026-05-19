"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  date: string;
  time: string;
  media: EventMedia[];
  isActive: boolean;
  order: number;
};

/**
 * Featured Events Carousel Component
 * Auto-scrolls through multiple featured events every 5 seconds
 * Pauses on user interaction (manual navigation)
 */
export function FeaturedEventCarousel() {
  const shouldReduceMotion = useReducedMotion();
  
  const [events, setEvents] = useState<FeaturedEventData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/featured-event');
        if (res.ok) {
          const data = await res.json();
          // Handle both array (new) and single event (old) format
          const eventList = Array.isArray(data) ? data : data.isActive ? [data] : [];
          setEvents(eventList);
        }
      } catch (error) {
        console.error('Failed to fetch featured events:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (events.length <= 1 || !isAutoPlay) {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [events, currentIndex, isAutoPlay]);

  function handlePrevious() {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setIsAutoPlay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev + 1) % events.length);
    setIsAutoPlay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  }

  function goToSlide(index: number) {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlay(true), 10000);
  }

  if (isLoading) {
    return (
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="h-96 bg-white/5 rounded-2xl animate-pulse"></div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  const event = events[currentIndex];
  const featuredMedia = event.media?.[0];

  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header - Compact */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.36em] text-teal-200/60">Featured moment</p>
           <h2 className="mt-4 font-serif text-[clamp(3rem,7vw,5.2rem)] leading-[0.92] tracking-tighter text-white">
             This week's highlight
            </h2>
          </div>
          {events.length > 1 && (
            <p className="hidden sm:block text-[0.65rem] uppercase tracking-[0.2em] text-white/35">
              {currentIndex + 1} of {events.length}
            </p>
          )}
        </div>

        {/* Carousel - Landscape Hero Card */}
        <motion.div
          key={currentIndex}
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={shouldReduceMotion ? {} : { opacity: 1 }}
          exit={shouldReduceMotion ? {} : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-80 sm:h-87.5 lg:h-97.5 rounded-[1.35rem] overflow-hidden border border-white/10 bg-black/30 group"
        >
          {/* Background Image */}
          {featuredMedia && (
            <>
              {featuredMedia.mediaType === 'video' ? (
                <>
                  {featuredMedia.posterUrl && (
                    <Image
                      src={featuredMedia.posterUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                  <video
                    src={featuredMedia.imageUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    poster={featuredMedia.posterUrl}
                  />
                </>
              ) : (
                <Image
                  src={featuredMedia.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </>
          )}

          {/* Readability overlay */}
          <div className="absolute inset-0 bg-black/28"></div>

          {/* Bottom-left content block */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
            <div className="max-w-2xl rounded-2xl border border-white/10 bg-black/38 backdrop-blur-sm px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-5">
              <div className="max-w-xl space-y-3">
                <div>
                  <h3 className="font-serif text-[clamp(1.7rem,3vw,2.7rem)] leading-[1.05] tracking-tight text-white">
                    {event.title}
                  </h3>
                  {event.subtitle && (
                    <p className="mt-2 text-sm sm:text-base lg:text-lg font-medium text-teal-100/95">
                      {event.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm lg:text-[0.95rem] text-white/88">
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <span className="text-teal-300">📍</span>
                      <span>{event.location}</span>
                    </div>
                  )}

                  {(event.date || event.time) && (
                    <div className="flex items-center gap-2">
                      <span className="text-teal-300">📅</span>
                      <span>
                        {event.date && event.time ? `${event.date} at ${event.time}` : event.date || event.time}
                      </span>
                    </div>
                  )}
                </div>

                {event.description && (
                  <p className="hidden md:block max-w-xl text-sm lg:text-base leading-[1.6] text-white/78 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls - Top right to keep them away from the text block */}
          {events.length > 1 && (
            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-2 py-2 backdrop-blur-sm">
              <button
                onClick={handlePrevious}
                className="rounded-full p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="hidden md:flex items-center gap-1.5 px-1.5">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? "w-6 h-2 bg-teal-300"
                        : "w-2 h-2 bg-white/35 hover:bg-white/55"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="rounded-full p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
