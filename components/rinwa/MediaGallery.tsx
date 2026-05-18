"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { galleryItems } from "./data";
import { useAutoplayIndex } from "./use-autoplay-index";

type MediaEntry = {
  _id?: string;
  imageUrl: string;
  mediaType?: "image" | "video";
  posterUrl?: string;
  caption?: string;
  order?: number;
};

function fallbackEntries(): MediaEntry[] {
  return galleryItems.map((item) => ({
    imageUrl: item.src,
    mediaType: item.kind,
    posterUrl: item.poster,
    caption: `${item.title} — ${item.caption}`,
    order: 0,
  }));
}

/**
 * Live media carousel.
 * The section reads from the media API and gracefully falls back to curated demo content.
 */
export function MediaGallery() {
  const shouldReduceMotion = useReducedMotion();
  const [items, setItems] = useState<MediaEntry[]>(fallbackEntries());
  const [paused, setPaused] = useState(false);
  const { index, setIndex, next, prev } = useAutoplayIndex(items.length, 5500, paused);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setItems(fallbackEntries());
          return;
        }

        const normalized = data
          .filter((item) => item?.imageUrl)
          .map((item) => ({
            _id: item._id,
            imageUrl: item.imageUrl,
            mediaType: item.mediaType === "video" ? "video" : "image",
            posterUrl: item.posterUrl || item.imageUrl,
            caption: item.caption || "",
            order: item.order ?? 0,
          }))
          .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

        setItems(normalized.length > 0 ? normalized : fallbackEntries());
      })
      .catch(() => setItems(fallbackEntries()));
  }, []);

  const activeItem = items[index] ?? items[0];
  const focusItems = useMemo(() => items.slice(0, 5), [items]);
  const videoCount = useMemo(() => items.filter((item) => item.mediaType === "video").length, [items]);
  const imageCount = Math.max(items.length - videoCount, 0);

  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="space-y-6">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">Media archive</p>
              <h2 className="mt-4 max-w-lg font-serif text-[clamp(3rem,7vw,5.2rem)] leading-[0.92] tracking-tighter text-white">
                The moments clients actually see.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">
                A live archive of stills and motion, arranged the same way we think about the brand: composed, editorial, and easy to scan.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-4xl border border-white/10 bg-[#07171a]/78 p-5 shadow-[0_18px_80px_rgba(0,0,0,0.22)]">
                <p className="text-xs uppercase tracking-[0.32em] text-teal-100/70">Live items</p>
                <p className="mt-4 font-serif text-4xl text-white">{items.length}</p>
                <p className="mt-3 text-sm leading-7 text-white/60">Pulled directly from the admin media library.</p>
              </div>
              <div className="rounded-4xl border border-white/10 bg-[#07171a]/78 p-5 shadow-[0_18px_80px_rgba(0,0,0,0.22)]">
                <p className="text-xs uppercase tracking-[0.32em] text-teal-100/70">Format mix</p>
                <p className="mt-4 font-serif text-4xl text-white">{videoCount}/{imageCount}</p>
                <p className="mt-3 text-sm leading-7 text-white/60">Motion clips vs still images in the current set.</p>
              </div>
            </div>

            <div className="rounded-4xl border border-white/10 bg-white/4 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-teal-100/70">Reading order</p>
              <div className="mt-4 grid gap-3 text-sm text-white/72">
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#041114]/55 px-4 py-3">
                  <span>Featured frame</span>
                  <span className="text-white/45">Autoplaying</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#041114]/55 px-4 py-3">
                  <span>Supporting captures</span>
                  <span className="text-white/45">Manual browse</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#041114]/55 px-4 py-3">
                  <span>Latest uploads</span>
                  <span className="text-white/45">Live feed</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-4xl border border-white/10 bg-[#061216] shadow-[0_16px_60px_rgba(0,0,0,0.22)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
              <motion.div
                key={activeItem?._id ?? activeItem?.imageUrl}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative min-h-96 overflow-hidden bg-black/20"
              >
                {activeItem?.mediaType === "video" ? (
                  <video
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    preload="metadata"
                    poster={activeItem.posterUrl || activeItem.imageUrl}
                  >
                    <source src={activeItem.imageUrl} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={activeItem?.imageUrl || fallbackEntries()[0].imageUrl}
                    alt={activeItem?.caption || "Media item"}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center"
                  />
                )}

                <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-[#041114]/84 px-5 py-4 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4 text-sm text-white/78">
                    <div>
                      <p className="text-[0.64rem] uppercase tracking-[0.3em] text-teal-100/75">
                        {activeItem?.mediaType || "image"}
                      </p>
                      <p className="mt-1 text-sm text-white/72">{activeItem?.caption || "Untitled media"}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.26em] text-white/40">
                      {index + 1}/{items.length}
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col justify-between gap-6 p-5 sm:p-6">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.32em] text-teal-200/75">Archive notes</p>
                  <h3 className="mt-4 font-serif text-3xl leading-tight text-white">
                    Built to support the brand story, not distract from it.
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/58">
                    The latest media appears in a balanced editorial block, with quick controls for browsing and enough context to understand what the client is seeing.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={prev}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/78 transition hover:border-teal-300/40 hover:bg-white/10 hover:text-white"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/78 transition hover:border-teal-300/40 hover:bg-white/10 hover:text-white"
                  >
                    <ChevronRight size={16} />
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaused((current) => !current)}
                    className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
                  >
                    <Play size={14} />
                    {paused ? "Resume" : "Pause"}
                  </button>
                </div>

                <div className="grid gap-3">
                  {focusItems.map((item, itemIndex) => (
                    <button
                      key={item._id ?? `${item.imageUrl}-${itemIndex}`}
                      type="button"
                      onClick={() => setIndex(itemIndex)}
                      aria-current={index === itemIndex}
                      className={`group flex items-center gap-4 rounded-[1.35rem] border p-3 text-left transition ${
                        index === itemIndex
                          ? "border-teal-300/45 bg-white/6"
                          : "border-white/10 bg-white/4 hover:border-white/20"
                      }`}
                    >
                      <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-2xl bg-black/20">
                        <Image
                          src={item.posterUrl || item.imageUrl}
                          alt={item.caption || "Media preview"}
                          fill
                          sizes="64px"
                          className="object-cover object-center transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm text-white/82">{item.caption || "Untitled media"}</p>
                          <span className="rounded-full border border-white/10 bg-[#041114]/75 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/55">
                            {item.mediaType || "image"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">Tap to feature</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
