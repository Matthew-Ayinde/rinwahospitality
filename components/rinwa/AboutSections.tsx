"use client";

import { motion, useReducedMotion } from "framer-motion";

const whoWeServe = [
  "Step into new cultural markets with absolute authenticity.",
  "Cultivate deep, trusted, and lasting local relationships.",
  "Design high-impact, multi-sensory experiences that people emotionally resonate with.",
  "Navigate community networks, nonprofits, and government stakeholders with total ease.",
];

export default function AboutSections() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
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
          <h2 className="mt-5 font-serif text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.92] tracking-[-0.05em] text-white">
            Your cultural bridge<br className="hidden sm:block" /> across the diaspora.
          </h2>
        </div>

        {/* Two‑column body */}
        <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-14 items-start">

          {/* Left — description */}
          <div>
            <div className="space-y-5 text-base leading-[1.95] text-white/68">
              <p>
                Expanding into an unfamiliar market should never feel like a guessing game.
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

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-block rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Let&apos;s Connect
              </a>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/4 px-5 py-3">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-300" />
                <span className="text-[0.67rem] uppercase tracking-[0.28em] text-white/50">
                  Ottawa · Toronto · Lagos
                </span>
              </div>
            </div>
          </div>

          {/* Right — Who We Empower card */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <div className="rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
              <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
                Who We Empower
              </p>
              <p className="mt-4 font-serif text-[clamp(1.25rem,2.4vw,1.65rem)] leading-[1.22] tracking-[-0.02em] text-white">
                Visionary founders, global brands, and institutions to:
              </p>

              <div className="mt-6 space-y-3">
                {whoWeServe.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 14 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.09 }}
                    className="flex items-start gap-4 rounded-[1.35rem] border border-white/8 bg-white/3 px-4 py-3.5"
                  >
                    <span className="mt-[3px] flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                    </span>
                    <p className="text-sm leading-6 text-white/68">{item}</p>
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
