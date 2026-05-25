"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export function AboutSections() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
          About
        </p>
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[0.96] tracking-[-0.04em] text-white">
          {/* Designed with intent.
          <br /> */}
          Built on lived experience.
        </h2>
        <p className="mx-auto mt-5 text-base leading-8 text-white/58">
          At the core of her work is a simple idea: experiences should improve
          the quality of human life.
        </p>
      </div>

      <div className="mt-16 space-y-10">
        {/* Our Story Card */}
        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="grid gap-8 rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:p-12"
        >
          <div className="flex items-stretch lg:order-1">
            <div className="relative w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/picture.avif"
                alt="The beginnings of The Badést Experience"
                width={520}
                height={640}
                priority
                className="h-full min-h-72 w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center lg:order-2">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              Our Story
            </p>
            <h3 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3rem)] leading-[1.02] tracking-[-0.04em] text-white">
              What started as a response to uncertainty
            </h3>

            <blockquote className="mt-8 border-l-2 border-teal-300/30 pl-5">
              <p className="font-serif text-[1.05rem] italic leading-8 text-white/72">
                "She realized she wasn't building something temporary — she was
                building a path rooted in her strengths, her lived experience,
                and her understanding of human needs."
              </p>
            </blockquote>

            <p className="mt-7 text-base leading-8 text-white/68">
              Fueled by homesickness and a desire to nurture a warm, supportive
              community for international students in Ottawa, Badé discovered
              her passion for hospitality and event planning. In December 2013,
              she organized her first event — welcoming a group of 10
              international students into her home.
            </p>

            <p className="mt-5 text-base leading-8 text-white/60">
              Building on that first gathering, she continued hosting yearly
              events — establishing her space as a central hub for connecting,
              supporting, and celebrating international students in Ottawa.
              What started as a response to uncertainty became clarity, purpose,
              direction, and impact.
            </p>

            <p className="mt-5 text-base leading-8 text-white/52">
              In August 2022, Badé Obasa founded The Badést Experience to
              redefine event hospitality — curating high-quality experiences
              that foster social wellness, belonging, and meaningful human
              connection in Ottawa's Black community and beyond.
            </p>
          </div>
        </motion.article>

        {/* About Founder Card */}
        <motion.article
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.85, ease: "easeOut", delay: 0.08 }}
          className="grid gap-8 rounded-[2.25rem] border border-white/10 bg-[#041114]/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:p-12"
        >
          <div className="flex flex-col justify-center">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">
              About the Founder
            </p>
            <h3 className="mt-4 font-serif text-[clamp(1.9rem,4vw,3rem)] leading-[1.02] tracking-[-0.04em] text-white">
              Badé Obasa
            </h3>

            <div className="mt-5 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
              <span className="text-[0.68rem] uppercase tracking-[0.28em] text-white/58">
                Experiential Producer
              </span>
            </div>

            <p className="mt-7 text-base leading-8 text-white/68">
              Badé is a cross-cultural experience strategist working across
              Nigeria and Canada. Her work sits at the intersection of
              hospitality, human behavior, and organizational culture — with
              over a decade of experience across events, human resources, and
              community systems.
            </p>

            <p className="mt-5 text-base leading-8 text-white/60">
              Badé doesn't just bring people together. She designs environments
              that intentionally shape how connection is made. To her, a
              meaningful experience is not just something you attend — it is
              something you feel. Something that stays with you.
            </p>

            <blockquote className="mt-8 border-l-2 border-teal-300/30 pl-5">
              <p className="font-serif text-[1.05rem] italic leading-8 text-white/72">
                "Even if the most memorable part is something as simple as the
                food, a renewed sense of confidence, a new friendship, or a
                deeper sense of self-awareness — the event has done its job. It
                has fulfilled a human need."
              </p>
            </blockquote>

            <div className="mt-8 rounded-2xl border border-white/8 bg-white/3 px-5 py-4">
              <p className="text-[0.66rem] uppercase tracking-[0.28em] text-teal-100/52">
                Recognition
              </p>
              <p className="mt-2 text-sm leading-7 text-white/60">
                Nominated for "Best Event Planner" and "Best Event Planning
                Company" at the 2023 Ottawa Awards — a recognition of her
                commitment to community-centered hospitality and exceptional
                experiences.
              </p>
            </div>
          </div>

          <div className="flex items-stretch">
            <div className="relative w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/picture.avif"
                alt="Badé Obasa — Experiential Producer"
                width={520}
                height={640}
                className="h-full min-h-72 w-full object-cover"
              />
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

export default AboutSections;
