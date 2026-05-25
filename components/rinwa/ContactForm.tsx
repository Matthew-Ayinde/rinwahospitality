"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { contactFeelings, contactGoals, contactIndustries } from "./data";
import toast from "react-hot-toast";

const CURRENCIES = [
  { code: "NGN", symbol: "₦", label: "Naira" },
  { code: "USD", symbol: "$", label: "USD" },
  { code: "CAD", symbol: "CA$", label: "CAD" },
  { code: "GBP", symbol: "£", label: "GBP" },
  { code: "EUR", symbol: "€", label: "EUR" },
] as const;

/**
 * Refined inquiry form.
 * The fields are grouped into two intentional steps so the experience feels human and calm.
 */
export function ContactForm() {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState<1 | 2>(1);
  const [industries, setIndustries] = useState<string[]>([contactIndustries[0]]);
  const [goals, setGoals] = useState<string[]>([contactGoals[0]]);
  const [feelings, setFeelings] = useState<string[]>([contactFeelings[0].label]);
  const [customFeeling, setCustomFeeling] = useState("");
  const [currency, setCurrency] = useState<string>("NGN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    projectDate: "",
    estimatedBudget: "",
    description: "",
  });

  const stepLabel = useMemo(() => (step === 1 ? "Tell us who you are" : "Share the shape of the project"), [step]);

  const toggleGoal = (goal: string) => {
    setGoals((current) => (current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]));
  };

  const toggleFeeling = (feeling: string) => {
    setFeelings((current) => (current.includes(feeling) ? current.filter((item) => item !== feeling) : [...current, feeling]));
  };

  const addCustomFeeling = () => {
    const nextFeeling = customFeeling.trim();

    if (!nextFeeling) {
      return;
    }

    setFeelings((current) => (current.includes(nextFeeling) ? current : [...current, nextFeeling]));
    setCustomFeeling("");
  };

  const toggleIndustry = (industry: string) => {
    setIndustries((current) =>
      current.includes(industry) ? current.filter((item) => item !== industry) : [...current, industry]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.company ||
      !formData.location ||
      !formData.projectDate ||
      !formData.estimatedBudget ||
      !formData.description ||
      industries.length === 0 ||
      feelings.length === 0
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const submittedFeelings = Array.from(new Set([...feelings, customFeeling.trim()].filter(Boolean)));

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          location: formData.location,
          projectDate: formData.projectDate,
          estimatedBudget: parseInt(formData.estimatedBudget),
          currency,
          description: formData.description,
          industries,
          industry: industries,
          goals,
            feelings: submittedFeelings,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit");
      }

      const data = await res.json();

      if (data.emailDelivered === false) {
        const warning = Array.isArray(data.emailWarnings) && data.emailWarnings.length > 0 ? data.emailWarnings[0] : "We received your inquiry, but email delivery failed on our side.";
        toast.error(warning);
      } else {
        toast.success("Thank you! We'll be in touch within 48 hours.");
      }
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        location: "",
        projectDate: "",
        estimatedBudget: "",
        description: "",
      });
      setCurrency("NGN");
      setStep(1);
      setIndustries([contactIndustries[0]]);
      setGoals([contactGoals[0]]);
      setFeelings([contactFeelings[0].label]);
      setCustomFeeling("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
        <div className="max-w-xl">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-teal-200/75">Contact / inquiry</p>
          <h2 className="mt-4 font-serif text-[clamp(3rem,7vw,5.2rem)] leading-[0.94] tracking-tighter text-white">
            Share your vision with us.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/68">
            We partner with brands and institutions to design culture-driven experiences.
          </p>

          <div className="mt-10 rounded-4xl border border-white/10 bg-white/4 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-teal-100/70">Project pulse</p>
            <div className="mt-4 space-y-2 text-sm text-white/72">
              <p>Step: {stepLabel}</p>
              {formData.location && <p>Location: {formData.location}</p>}
              <p>Industries: {industries.join(" • ")}</p>
              <p>Goals: {goals.join(" • ")}</p>
              <p>Feelings: {Array.from(new Set([...feelings, customFeeling.trim()].filter(Boolean))).join(" • ")}</p>
            </div>
          </div>
        </div>

        <motion.form
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="rounded-[2.25rem] border border-white/10 bg-white/4 p-5 shadow-[0_20px_90px_rgba(0,0,0,0.22)] sm:p-6"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-teal-100/70">Inquiry flow</p>
              <p className="mt-2 font-serif text-2xl text-white">{step === 1 ? "Step 1 of 2" : "Step 2 of 2"}</p>
            </div>
            <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-white/45">
              <span className={`h-2.5 w-2.5 rounded-full ${step === 1 ? "bg-teal-300" : "bg-white/20"}`} />
              <span className={`h-2.5 w-2.5 rounded-full ${step === 2 ? "bg-teal-300" : "bg-white/20"}`} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="pt-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    label="Full Name"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Company / Brand"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Project Timeline"
                    name="projectDate"
                    type="text"
                    value={formData.projectDate}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Location / City"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                  />

                  {/* Budget + Currency — full width */}
                  <div className="sm:col-span-2 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-[0.24em] text-white/50">Estimated Budget</span>
                      <div className="flex gap-1.5">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => setCurrency(c.code)}
                            className={`rounded-full border px-3 py-1 text-xs transition-all duration-300 ${
                              currency === c.code
                                ? "border-teal-300 bg-teal-300/15 text-teal-100"
                                : "border-white/10 bg-white/5 text-white/55 hover:border-teal-300/40 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {c.symbol}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/45">
                        {CURRENCIES.find((c) => c.code === currency)?.symbol}
                      </span>
                      <input
                        type="number"
                        name="estimatedBudget"
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full min-h-14 rounded-2xl border border-white/10 bg-[#041114]/60 pl-12 pr-4 py-4 text-white placeholder:text-white/28 outline-none transition focus:border-teal-300/50 focus:bg-[#07171a] focus:shadow-[0_0_0_4px_rgba(125,211,207,0.08)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-white/70">Industries</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">Select one or more</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contactIndustries.map((option) => (
                      <ChipButton key={option} active={industries.includes(option)} onClick={() => toggleIndustry(option)}>
                        {option}
                      </ChipButton>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-full bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-teal-200"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="pt-6"
              >
                <label className="block space-y-3">
                  <span className="block text-xs uppercase tracking-[0.24em] text-white/50">Description</span>
                  <textarea
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about the atmosphere, audience, and outcome you want to create."
                    className="w-full rounded-2xl border border-white/10 bg-[#041114]/60 px-4 py-4 text-white placeholder:text-white/28 outline-none transition focus:border-teal-300/50 focus:bg-[#07171a] focus:shadow-[0_0_0_4px_rgba(125,211,207,0.08)]"
                  />
                </label>

                <div className="mt-6">
                  <p className="text-sm text-white/70">Success metrics</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contactGoals.map((goal) => (
                      <ChipButton key={goal} active={goals.includes(goal)} onClick={() => toggleGoal(goal)}>
                        {goal}
                      </ChipButton>
                    ))}
                  </div>
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/70">How do you want to feel?</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/35">
                        Pick one or more, then add your own words if needed
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">Mood / vibe</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {contactFeelings.map((option) => (
                      <ChipButton
                        key={option.label}
                        active={feelings.includes(option.label)}
                        onClick={() => toggleFeeling(option.label)}
                      >
                        <span className="mr-2" aria-hidden="true">
                          {option.emoji}
                        </span>
                        {option.label}
                      </ChipButton>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <label className="flex-1 space-y-2">
                      <span className="block text-xs uppercase tracking-[0.24em] text-white/45">Add your own</span>
                      <input
                        type="text"
                        value={customFeeling}
                        onChange={(event) => setCustomFeeling(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addCustomFeeling();
                          }
                        }}
                        placeholder="e.g. seen, celebrated, safe, expansive"
                        className="w-full min-h-14 rounded-2xl border border-white/10 bg-[#041114]/60 px-4 py-4 text-white placeholder:text-white/28 outline-none transition focus:border-teal-300/50 focus:bg-[#07171a] focus:shadow-[0_0_0_4px_rgba(125,211,207,0.08)]"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={addCustomFeeling}
                      className="self-end rounded-full border border-teal-300/30 bg-teal-300/10 px-5 py-3 text-sm font-semibold text-teal-100 transition duration-300 hover:border-teal-200/50 hover:bg-teal-300/15"
                    >
                      Add feeling
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm text-white/78 transition duration-300 hover:border-teal-300/40 hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-teal-300 px-6 py-4 text-base font-semibold text-slate-950 transition duration-300 hover:bg-teal-200 hover:shadow-[0_0_35px_rgba(125,211,207,0.18)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "I’m Here, I’ve Arrived"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block space-y-3">
      <span className="block text-xs uppercase tracking-[0.24em] text-white/50">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full min-h-14 rounded-2xl border border-white/10 bg-[#041114]/60 px-4 py-4 text-white placeholder:text-white/28 outline-none transition focus:border-teal-300/50 focus:bg-[#07171a] focus:shadow-[0_0_0_4px_rgba(125,211,207,0.08)]"
      />
    </label>
  );
}

function ChipButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
        active
          ? "border-teal-300 bg-teal-300/15 text-teal-100"
          : "border-white/10 bg-white/5 text-white/70 hover:border-teal-300/40 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
