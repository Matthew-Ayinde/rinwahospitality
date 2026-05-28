"use client";

import { motion, useReducedMotion } from "framer-motion";

const milestones = [
  { number: "14", label: "Years in Canada" },
  { number: "3", label: "Months to unlock Lagos" },
  { number: "15", label: "Distinct experiences mapped" },
];

export function OurStorySection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="story" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section label + editorial headline */}
        <div className="mb-14 lg:mb-20">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
            Our Story
          </p>
          <h2 className="mt-5 font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.055em] text-white">
            14 Years Away.{" "}
            <span className="text-white/45">3 Months.</span>
            <br />
            1 Reconnection.
          </h2>
        </div>

        {/* Main two‑column layout */}
        <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 items-start">

          {/* Left — story text + milestone row */}
          <div>
            <div className="space-y-5 text-base leading-[1.95] text-white/65">
              <p>
                The foundation of RÌNWÁ is built on a powerful personal journey of cultural
                reconnection. After 14 years in Canada, our founder returned to Lagos. What
                began as a personal voyage of rediscovery rapidly evolved into a masterclass
                in swift ecosystem navigation.
              </p>
              <p>
                Within just three months of touching down, she effortlessly unlocked the
                local landscape. Leveraging her deep expertise in experience design, she
                immediately began collaborating with elite local establishments. Most
                notably, she partnered with premier Lagos hotspot{" "}
                <span className="text-white/88 font-medium">The Terrace</span>
                , the rooftop of The House, to orchestrate and soft‑launch their new
                mid‑week stream: a curated evening offering thoughtfully designed for the
                after‑work hours of busy, high‑profile Lagosians.
              </p>
              <p>
                From there, she went on to map out 15 distinct experiences, uncovering
                hidden gems and exclusive cultural touchpoints that even lifelong residents
                had yet to explore.
              </p>
              <p>
                This rapid immersion proved an undeniable truth: with the right cultural
                fluency and relationship capital, capturing a new market doesn&apos;t have to
                take years. RÌNWÁ was built from this exact blueprint — we exist to
                fast‑track that journey for others, serving as the definitive, trusted
                guide for coming home, honouring your heritage, or expanding your business.
              </p>
            </div>

            {/* Milestone stats */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                  className="rounded-[1.6rem] border border-white/10 bg-[#041114]/50 p-5 text-center"
                >
                  <p className="font-serif text-[clamp(2rem,4.5vw,3rem)] leading-none tracking-[-0.04em] text-teal-300">
                    {m.number}
                  </p>
                  <p className="mt-2.5 text-[0.63rem] uppercase tracking-[0.22em] text-white/42">
                    {m.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — feature cards */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >

            {/* The Terrace callout */}
            <div className="rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
              <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
                First Move
              </p>
              <p className="mt-5 font-serif text-[clamp(1.35rem,2.6vw,1.9rem)] leading-[1.18] tracking-[-0.03em] text-white">
                Partnered with The Terrace to launch Lagos&apos;s most sought‑after mid‑week experience.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/58">
                The Terrace, rooftop of The House — one of Lagos&apos;s premier hospitality
                destinations. A soft‑launch that proved cultural fluency moves faster than
                any conventional market strategy.
              </p>
            </div>

            {/* Blueprint quote */}
            <div className="rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
              <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
                The Blueprint
              </p>
              <blockquote className="mt-5">
                <p className="font-serif text-[1.08rem] italic leading-[1.9] text-white/72">
                  &ldquo;With the right cultural fluency and relationship capital, capturing
                  a new market doesn&apos;t have to take years. RÌNWÁ was built from this
                  exact blueprint.&rdquo;
                </p>
                <footer className="mt-5">
                  <p className="text-[0.67rem] uppercase tracking-[0.28em] text-white/38">
                    — RÌNWÁ Foundation
                  </p>
                </footer>
              </blockquote>
            </div>

            {/* Badge */}
            <div className="self-start">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/4 px-5 py-3">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                <span className="text-[0.67rem] uppercase tracking-[0.28em] text-white/50">
                  Built on Cultural Fluency &amp; Relationship Capital
                </span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
