"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Play, X, CheckCircle, Loader2 } from "lucide-react";

const platforms = [
  {
    name: "X / Twitter",
    handle: "@rinwahospitality",
    link: "https://x.com/thebadestevents",
    followers: "6.1K",
    cta: "Read",
    gradient: "from-[#0f172a]/40 via-[#111827]/20 to-[#08161b]",
    preview: "Thoughts on hospitality, culture, and community-led brand building.",
  },
  {
    name: "TikTok",
    handle: "@rinwahospitality",
    link: "https://www.tiktok.com/@thebadestevents",
    followers: "22.7K",
    cta: "Watch",
    gradient: "from-[#7c2d12]/30 via-[#111827]/20 to-[#120b0a]",
    preview: "Short-form event recaps, room reveals, and warm social moments.",
  },
  {
    name: "YouTube",
    handle: "RÌNWÁ TV",
    link: "https://www.youtube.com/@thebadestevents",
    followers: "9.8K",
    cta: "Join",
    gradient: "from-[#0c4a6e]/35 via-[#111827]/20 to-[#08131f]",
    preview: "Mini-docs, event films, and longer narrative stories.",
  },
];

const featuredReel = {
  title: "Come see Lagos through my eyes",
  handle: "@ladybaderinwa",
  creator: "ladybaderinwa",
  link: "https://www.instagram.com/reel/DYwlP74skgA/?igsh=bDVlZ292cTF5MzNx",
  badge: "Featured stories",
  audio: "Original audio",
  duration: "Watch on Instagram",
  caption:
    "My heart never left home, even after 14 years abroad. This reconnection trip feels like meeting myself again, so while I'm here building...",
};

function SocialIcon({ platform }: { platform: string }) {
  const common = "h-5 w-5 text-teal-100";

  switch (platform) {
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17" cy="7" r="1" fill="currentColor" />
        </svg>
      );
    case "X / Twitter":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
  <path
    d="M4 4.5h4.5L12 9.5l3.8-5H20l-6 7.8L20 19.5h-4.6L12 14l-4 5.5H4l6.3-8.2L4 4.5Z"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
    fill="none"
  />
</svg>
      );
    case "TikTok":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M14 5c.7 2.8 2.7 4.8 5 5.2v3.1c-1.8 0-3.6-.5-5-1.4v4.1c0 3-2.4 5.5-5.5 5.5S3 19 3 15.9 5.4 10.4 8.5 10.4c.4 0 .8.1 1.2.2V14c-.4-.2-.8-.2-1.2-.2-1.3 0-2.3 1-2.3 2.2 0 1.3 1 2.3 2.3 2.3 1.2 0 2.2-1 2.2-2.3V5h3.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
  <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.6" />
  <path d="M10 9.5l5 2.5-5 2.5V9.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="currentColor" />
</svg>
      );
  }
}

function CommunityModal({ onClose }: { onClose: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim() || undefined }),
      });
      if (res.status === 409) {
        setStatus("duplicate");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Join the RÌNWÁ community"
    >
      {/* Backdrop */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#07171a] shadow-[0_32px_120px_rgba(0,0,0,0.5)]"
      >
        {/* Teal accent bar */}
        <div className="h-[3px] bg-linear-to-r from-teal-300 via-teal-400/70 to-transparent" />

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#7dd3cf]/8 blur-3xl" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        <div className="relative p-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="py-4 text-center"
              >
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-teal-300/30 bg-teal-300/10">
                  <CheckCircle className="h-7 w-7 text-teal-300" />
                </div>
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-teal-200/70">You&apos;re in</p>
                <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-white">
                  You&apos;ve arrived.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  Welcome to the RÌNWÁ community. Check your inbox for a warm welcome from us.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-teal-200/70">Community invitation</p>
                <h2 className="mt-3 font-serif text-[clamp(1.75rem,4vw,2.4rem)] leading-tight tracking-tight text-white">
                  Join the community.
                </h2>
              

                <form onSubmit={handleSubmit} className="mt-7 space-y-3" noValidate>
                  <div>
                    <label htmlFor="cm-firstname" className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.22em] text-white/40">
                      First name <span className="text-white/25">(optional)</span>
                    </label>
                    <input
                      id="cm-firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Your first name"
                      autoComplete="given-name"
                      disabled={status === "loading"}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-teal-300/40 focus:bg-white/8 focus:ring-1 focus:ring-teal-300/20 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="cm-email" className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.22em] text-white/40">
                      Email address
                    </label>
                    <input
                      id="cm-email"
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (status === "error" || status === "duplicate") setStatus("idle"); }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={status === "loading"}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-teal-300/40 focus:bg-white/8 focus:ring-1 focus:ring-teal-300/20 disabled:opacity-50"
                    />
                  </div>

                  {(status === "error" || status === "duplicate") && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400/90"
                    >
                      {status === "duplicate"
                        ? "This email is already part of the community."
                        : errorMsg}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading" || !email.trim()}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-300 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Joining…
                      </>
                    ) : (
                      "Join the Community"
                    )}
                  </button>
                </form>

                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export function SocialPresence() {
  const shouldReduceMotion = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section aria-labelledby="social-presence" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">Social presence</p>
          <h2 id="social-presence" className="mt-4 font-serif text-[clamp(3rem,7vw,5.2rem)] leading-[0.92] tracking-tighter text-white">
            Come online.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/68">
            Follow the narrative across image, motion, and long-form storytelling. Each platform holds a different chapter of RÌNWÁ.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] xl:gap-6">
          <motion.a
            href={featuredReel.link}
            target="_blank"
            rel="noreferrer"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            className="group relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/4 shadow-[0_18px_80px_rgba(0,0,0,0.22)]"
            aria-label="Watch the featured Instagram reel by ladybaderinwa"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,207,0.18),transparent_34%),linear-gradient(145deg,rgba(7,23,26,0.95),rgba(4,17,20,0.88))]" />
            <div className="absolute inset-0 opacity-80 bg-[linear-gradient(135deg,rgba(20,184,166,0.18),transparent_28%,transparent_72%,rgba(255,255,255,0.04))]" />
            <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-teal-300/12 blur-3xl transition duration-700 group-hover:bg-teal-300/18" />
            <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#cb6b4f]/10 blur-3xl transition duration-700 group-hover:bg-[#cb6b4f]/14" />

            <div className="relative grid min-h-128 gap-6 p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:p-10">
              <div className="flex flex-col justify-between gap-8">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.68rem] uppercase tracking-[0.28em] text-teal-100/78 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                    {featuredReel.badge}
                  </div>

                  <div className="space-y-3">
                    <h3 className="max-w-md font-serif text-[clamp(2.35rem,4.5vw,4.35rem)] leading-[0.94] tracking-[-0.04em] text-white">
                      {featuredReel.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                      {featuredReel.caption}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-white/48">
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">{featuredReel.audio}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-4 py-3 text-sm font-semibold text-slate-950 transition duration-300 group-hover:bg-teal-200">
                    <Play size={15} />
                    {featuredReel.duration}
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-4xl border border-white/10 bg-black/14 shadow-[0_20px_80px_rgba(0,0,0,0.28)]" />
                <div className="relative w-full max-w-84 overflow-hidden rounded-4xl border border-white/12 bg-[#041114]/72 p-3 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:max-w-92">
                  <div className="relative aspect-9/16 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(13,29,31,0.4),rgba(4,17,20,0.2))]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(125,211,207,0.22),transparent_26%),radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_72%_70%,rgba(203,107,79,0.16),transparent_20%),linear-gradient(180deg,rgba(8,24,27,0.15),rgba(4,17,20,0.72))]" />
                    <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),transparent)]" />

                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 text-white/88">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[0.64rem] uppercase tracking-[0.28em] backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                        Reel
                      </div>
                      <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[0.64rem] uppercase tracking-[0.28em] backdrop-blur-sm">
                        {featuredReel.creator}
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid h-24 w-24 place-items-center rounded-full border border-white/18 bg-black/25 backdrop-blur-sm transition duration-300 group-hover:scale-105 group-hover:bg-black/35">
                        <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-slate-950 shadow-[0_0_0_12px_rgba(255,255,255,0.09)]">
                          <Play className="ml-0.5 h-6 w-6 fill-current" />
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </motion.a>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:gap-6">
            {platforms.map((platform, index) => (
              <motion.article
                key={platform.name}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.06, ease: "easeOut" }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/4"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${platform.gradient} opacity-90 transition duration-500 group-hover:opacity-100`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,207,0.16),transparent_35%)]" />

                <div className="relative flex h-full flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/20">
                        <SocialIcon platform={platform.name} />
                      </div>
                      <div>
                        <p className="text-sm text-white/65">{platform.handle}</p>
                      </div>
                    </div>
                     <Link href={platform.link} target="_blank" rel="noreferrer" className="rounded-full cursor-pointer bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-teal-200">
                        View profile
                      </Link>
                  </div>

                  <div className="mt-8 space-y-5">
                    <p className="max-w-xs text-sm leading-7 text-white/72">{platform.preview}</p>
                    <div className="flex flex-wrap gap-2">
                     
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-4xl border border-white/10 bg-white/3 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-teal-100/70">Community invitation</p>
              <p className="mt-2 text-lg text-white/82">Join the community for behind-the-scenes stories, exclusive invites, and curated moments.</p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex shrink-0 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-teal-200"
            >
              Sign me up
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <CommunityModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
