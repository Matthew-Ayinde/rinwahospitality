"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";

const pillars = [
  {
    title: "The Cross-Continental Bridge",
    subtitle:
      "For the ambitious founders, global brands and institutions, navigating the corridor between North America and Africa",
    body: "We partner with you to provide the precise cultural intelligence, market insights, and local compliance needed for a foreign brand to transition into the Nigerian or Canadian business ecosystem. We ensure your brand or business integrates seamlessly without losing its premium identity or commercial impact.",
  },
  {
    title: "Strategic Presence",
    subtitle:
      "For those who dredge the exhausting trial-and-error of networking",
    body: "We show up as your trusted, high-credibility face on the ground. When executive teams are physically absent, overwhelmed, or managing operations from across the globe, RÌNWÁ steps in as the premier local delegate, ensuring your brand's interests are represented and executed with uncompromised organizational excellence.",
  },
  {
    title: "Human-Centered Architecture",
    subtitle:
      "For those who value excellence and refuse to settle for traditional, uninspired experiences",
    body: null,
  },
];

export default function AboutSections() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none select-none absolute right-[-6%] top-1/2 -translate-y-1/2 opacity-[0.045]">
        <Image
          src="/images/logo-home.png"
          alt=""
          width={560}
          height={560}
          className="rotate-6 object-contain"
        />
      </div>
      <div className="mx-auto max-w-7xl">

        {/* Etymology header */}
        <div className="mb-12 lg:mb-16">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              /RÌNWÁ/
            </p>
            <span className="font-serif text-[0.85rem] italic text-white/35">
              — means &ldquo;to come, to arrive&rdquo;
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-x-8 gap-y-4">
            <h2 className="font-serif text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.92] tracking-[-0.05em] text-white">
              Expanding into a new market<br className="hidden sm:block" /> across the diaspora.
            </h2>
            <div className="mb-1 hidden sm:flex items-center gap-6 pr-16">
              {["Ottawa", "Toronto", "Lagos"].map((city, i) => (
                <div key={city} className="flex items-center gap-6">
                  {i > 0 && <span className="h-6 w-px bg-white/15" />}
                  <div className="flex items-center gap-2.5 group">
                    <MapPin
                      size={20}
                      className="text-teal-400 drop-shadow-[0_0_8px_rgba(94,234,212,0.7)]"
                      strokeWidth={2}
                    />
                    <span className="text-sm uppercase tracking-[0.22em] text-white/80 font-medium">
                      {city}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two‑column body */}
        <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-14 items-start">

          {/* Left — description */}
          <div>
            <div className="space-y-5 text-base leading-[1.95] text-white/68">
              <p>
                Should never be a guessing game.
                RÌNWÁ operates as a premium cultural connector and experience architect,
                bridging the gap between distinct global ecosystems. We guide brands,
                institutions, and forward‑thinking founders through the complexities of the
                diaspora and African business landscapes, translating raw culture into
                high‑value strategic opportunities.
              </p>
              <p>
                We do more than connect community and institutional stakeholders, we
                seamlessly weave your brand into the very fabric of Lagos culture.
              </p>
              <p>
                Operating at the intersection of hospitality, culture, business, and
                community, we specialise in experience design, strategic hospitality,
                curated travel support, cross‑border engagement, and relationship‑driven
                execution. Our work supports organisations, founders, diaspora communities,
                and global audiences building meaningful presence across African and North
                American markets.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="#contact"
                className="inline-block rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Let&apos;s Bridge
              </a>
            </div>
          </div>

          {/* Right — Who We Empower card */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <div className="rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)] max-h-135 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
                Who We Are
              </p>
              <p className="mt-4 font-serif text-[clamp(1.25rem,2.4vw,1.65rem)] leading-[1.22] tracking-[-0.02em] text-white">
               Your cultural bridge across the diaspora. 
              </p>

              <p className="mt-7 text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
                Our Pillars
              </p>

              <div className="mt-4 space-y-0 divide-y divide-white/8">
                {pillars.map((pillar, i) => (
                  <motion.div
                    key={i}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 14 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.11 }}
                    className="py-5 first:pt-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1.25 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/10">
                        <span className="text-[0.6rem] font-semibold text-teal-300">{i + 1}</span>
                      </span>
                      <div>
                        <p className="text-sm font-semibold leading-snug text-white">
                          {pillar.title}
                        </p>
                        <p className="mt-1 text-[0.72rem] italic leading-relaxed text-teal-200/60">
                          {pillar.subtitle}
                        </p>
                        <p className="mt-2 text-xs leading-[1.75] text-white/55">
                          {i === 2 ? (
                            <>
                              Leveraging years of proven premium execution building{" "}
                              <a
                                href="https://thebadestevents.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 text-teal-300/80 hover:text-teal-300 transition-colors"
                              >
                                The Badést Events
                              </a>
                              , we specialize in strategic experience design for intimate events to large-scale productions. We don&apos;t just plan, manage or host high-profile events; we use consumer psychology and sensory curation to engineer environments that move people to show up, stay engaged, and create lasting cultural equity that outlive the final curtain call.
                            </>
                          ) : (
                            pillar.body
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
