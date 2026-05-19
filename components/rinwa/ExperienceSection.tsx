"use client";

import { motion, useReducedMotion } from "framer-motion";

const principles = [
  {
    label: "Intention",
    body: "From the guest list to the smallest detail, every element is designed with purpose — not just how it looks, but how it feels, how it flows, and what it leaves behind.",
  },
  {
    label: "Empathy",
    body: "Anticipating needs before they are spoken. Designing for comfort, inclusion, mental wellness, and awareness — because how people are treated shapes the experience itself.",
  },
  {
    label: "Belonging",
    body: "Each gathering is designed to leave people feeling seen, restored, and impacted — whether through connection, emotional depth, or a renewed sense of self.",
  },
];

const practiceAreas = [
  { area: "Mental Health & Wellness", tag: "Facilitated Spaces" },
  { area: "Inclusion & Belonging", tag: "Honest Dialogue" },
  { area: "Community Building", tag: "Cross-Cultural" },
];

export function ExperienceSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="experiences" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Left column — Manifesto */}
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
            The Practice
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.94] tracking-[-0.05em] text-white">
            Hospitality is not just a Service —
            <br />
            It&apos;s Design.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-white/60">
            The Badést experiences begin with intention. Not just how it looks,
            but how it feels, how it flows, and what it leaves behind. From the
            guest list to the smallest detail, everything is designed with
            purpose.
          </p>

          <div className="mt-10 space-y-4">
            {principles.map((principle, i) => (
              <motion.div
                key={principle.label}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                className="flex gap-5 rounded-[1.6rem] border border-white/8 bg-[#041114]/40 p-5"
              >
                <div className="mt-1 flex-shrink-0">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                  </span>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-teal-100/62">
                    {principle.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    {principle.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-9 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/4 px-5 py-3">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
            <span className="text-[0.68rem] uppercase tracking-[0.28em] text-white/55">
              Operating between Canada &amp; Nigeria
            </span>
          </div>
        </div>

        {/* Right column — Philosophy cards */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="flex flex-col gap-5"
        >
          {/* Core belief */}
          <div className="rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              Core Belief
            </p>
            <p className="mt-5 font-serif text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.12] tracking-[-0.03em] text-white">
              Experiences should improve the quality of human life.
            </p>
            <p className="mt-5 text-base leading-8 text-white/60">
              Whether through connection, emotional depth, or a sense of
              belonging — each gathering is designed to leave people feeling
              seen, restored, and impacted. To her, a meaningful experience is
              not just something you attend. It is something you feel. Something
              that stays with you.
            </p>
          </div>

          {/* Practice areas */}
          <div className="rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              Practice Areas
            </p>
            <div className="mt-5 space-y-3">
              {practiceAreas.map((item) => (
                <div
                  key={item.area}
                  className="flex items-center justify-between rounded-[1.35rem] border border-white/8 bg-white/3 px-5 py-4"
                >
                  <p className="text-sm font-medium text-white/82">{item.area}</p>
                  <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-white/48">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pull quote */}
          <div className="rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              On Meaningful Experiences
            </p>
            <blockquote className="mt-5">
              <p className="font-serif text-[1.1rem] italic leading-9 text-white/75">
                "Even if the most memorable part of an experience is something
                as simple as the food, a renewed sense of confidence, a new
                friendship, or a deeper sense of self-awareness — then the
                event has done its job. It has fulfilled a human need."
              </p>
              <footer className="mt-4">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/40">
                  — Badé Obasa
                </p>
              </footer>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
