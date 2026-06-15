"use client";

import { motion, useReducedMotion } from "framer-motion";

const services = [
  {
    number: "01",
    category: "Market Entry",
    title: "Ecosystem Integration",
    whatWeDo:
      "We partner with international institutions looking to anchor themselves in the Nigerian or Canadian market. We audit your brand's readiness for the local landscape, navigate regulatory hurdles, and deploy deep regional insights to ensure a seamless integration.",
    whatYouGet:
      "The market-entry blueprint. You gain the precise cultural know-how to scale your brand or launch a global production in a new city without facing operational friction, legal blindspots, or cultural missteps.",
    centered: false,
  },
  {
    number: "02",
    category: "Social Capital",
    title: "Corporate & Social Access",
    whatWeDo:
      "We serve as your high-credibility proxy and local gateway. We bridge the doors to the rooms that matter for your brand's success.",
    whatYouGet:
      "Direct access to key decision makers. By leveraging our vetted network and handling stakeholder alignment for you, we secure the trusted regional partnerships needed to run smooth, flawless productions while you stay focused on your vision.",
    centered: false,
  },
  {
    number: "03",
    category: "Cultural Experiences",
    title: "Experiential Design",
    whatWeDo:
      "Leveraging the foundation of The Badést Events, we design high-touch experiences, executive travel itineraries, and world-class brand activations. We strategically weave local flavor with international luxury standards using audience psychology.",
    whatYouGet:
      "Emotionally rich and high-converting environments intentionally built to captivate stakeholders, talent, and attendees alike. Your activations transition from traditional events into unforgettable, secure, and culturally resonant experiences that build absolute institutional trust.",
    centered: true,
  },
];

const pillars = [
  "Social Capital",
  "Local Intelligence",
  "Brand Positioning",
  "Cultural Fluency",
  "Cross-Border Expansion",
  "Premium Hospitality",
  "Diaspora Engagement",
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
          <div className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end">
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

        {/* Service grid — 01 & 02 side by side, 03 centred below */}
        <div className="grid gap-5 sm:grid-cols-4 lg:gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.1 }}
              className={[
                "flex flex-col rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.38)]",
                service.centered
                  ? "sm:col-span-2 sm:col-start-2"
                  : "sm:col-span-2",
              ].join(" ")}
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
