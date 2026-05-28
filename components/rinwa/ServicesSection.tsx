"use client";

import { motion, useReducedMotion } from "framer-motion";

const services = [
  {
    number: "01",
    category: "Cultural Experiences",
    title: "Cultural Immersive Curation & Production",
    whatWeDo:
      "Curate custom luxury itineraries, private VIP dinners, international trade delegations, and experiential brand pop-ups.",
    whatYouGet:
      "You bypass the friction and trial-and-error of navigating a new city, saving invaluable time while accessing the ecosystem at its highest echelon.",
  },
  {
    number: "02",
    category: "Market Entry",
    title: "Market Entry & Ecosystem Access",
    whatWeDo:
      "Execute market immersion strategies, map key cross-border partnerships, facilitate warm stakeholder introductions, and guide you through corporate, nonprofit, and institutional sectors.",
    whatYouGet:
      "Flawless, culturally intelligent integration into local markets, completely insulated from cultural missteps.",
  },
  {
    number: "03",
    category: "PR & Media",
    title: "Strategic PR, Media & Brand Positioning",
    whatWeDo:
      "Secure high-impact features across top-tier African media houses and digital platforms, arrange strategic podcast appearances, produce exclusive press launches, and direct narrative strategies.",
    whatYouGet:
      "Immediate authority, institutional trust, and undeniable thought leadership from day one.",
  },
  {
    number: "04",
    category: "Networking",
    title: "Relationship Capital & High-Net-Worth Networking",
    whatWeDo:
      "Facilitate exclusive, warm introductions to local founders, creators, tastemakers, and institutional gatekeepers through intentionally designed, closed-door conversation spaces.",
    whatYouGet:
      "Instant placement at the tables that matter, rapidly accelerating your brand equity.",
  },
];

const pillars = [
  "Insight",
  "Access",
  "Relationship Capital",
  "Positioning",
  "Cultural Fluency",
];

export function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="services" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Header row */}
        <div className="mb-14 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="lg:max-w-lg">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              Our Services
            </p>
            <h2 className="mt-5 font-serif text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.94] tracking-[-0.05em] text-white">
              How We Engineer<br />Your Presence.
            </h2>
          </div>

          {/* Pillars */}
          <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
            {pillars.map((pillar) => (
              <span
                key={pillar}
                className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[0.63rem] uppercase tracking-[0.26em] text-white/52"
              >
                {pillar}
              </span>
            ))}
          </div>
        </div>

        {/* 2×2 service grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.1 }}
              className="flex flex-col rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)]"
            >
              {/* Card header */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <p className="font-serif text-[2.8rem] leading-none tracking-[-0.04em] text-white/12 select-none">
                  {service.number}
                </p>
                <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.24em] text-teal-200/60">
                  {service.category}
                </span>
              </div>

              <h3 className="mb-6 font-serif text-[1.2rem] leading-[1.28] tracking-[-0.02em] text-white">
                {service.title}
              </h3>

              <div className="mt-auto space-y-3">
                <div className="rounded-[1.35rem] border border-white/8 bg-white/3 px-5 py-4">
                  <p className="mb-2 text-[0.63rem] uppercase tracking-[0.24em] text-teal-200/58">
                    What We Do
                  </p>
                  <p className="text-sm leading-6 text-white/60">
                    {service.whatWeDo}
                  </p>
                </div>
                <div className="rounded-[1.35rem] border border-white/8 bg-white/3 px-5 py-4">
                  <p className="mb-2 text-[0.63rem] uppercase tracking-[0.24em] text-teal-200/58">
                    What You Get
                  </p>
                  <p className="text-sm leading-6 text-white/80">
                    {service.whatYouGet}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
