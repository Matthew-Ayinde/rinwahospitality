"use client";

import { motion, useReducedMotion } from "framer-motion";

export function CulturalBridgeCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="cta" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] border border-white/10 bg-[#041114]/60 px-8 py-14 shadow-[0_20px_60px_rgba(0,0,0,0.42)] sm:px-12 lg:px-20 lg:py-20">

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="mb-6 text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              Your Next Move
            </p>

            <h2 className="font-serif text-[clamp(2.8rem,7.5vw,6rem)] leading-[0.88] tracking-[-0.055em] text-white">
              Don&apos;t just launch,
              <br />
              <span className="text-white/60">Engineer</span> your
              <br />
              influence.
            </h2>

            <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-12">
              <p className="text-base leading-[1.95] text-white/62">
                We deliver premium market entry and lifestyle public relations
                for diaspora-based founders and global brands determined to
                establish a commanding presence in the Nigerian market. From
                curating exclusive Lagos experiences to positioning you directly
                at the industry&apos;s high table, we don&apos;t simply plan
                your market arrival — we engineer your influence.
              </p>
              <p className="text-base leading-[1.95] text-white/52">
                Whether you are looking for a break in the city, you&apos;re an
                academic institution looking to bridge diaspora stakeholders, a
                global brand launching a high‑touch Lagos activation, or a
                visionary founder ready to project your story across African
                media platforms — we guide you to the keys to cross over with
                absolute ease.
              </p>
            </div>

            <div className="mt-10">
              <a
                href="#contact"
                className="inline-block rounded-full bg-teal-400 px-8 py-4 text-sm font-semibold text-black transition-opacity hover:opacity-88"
              >
                Let&apos;s Build Your Cultural Bridge
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
