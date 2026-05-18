'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Step = 1 | 2 | 3;

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      toast.error('Enter your admin email');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to send verification code');
      }

      toast.success('Verification code sent');
      setStep(2);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Server error');
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();

    if (!code) {
      toast.error('Enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Invalid or expired code');
      }

      toast.success('Code verified');
      setStep(3);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Server error');
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Unable to reset password');
      }

      toast.success('Password changed successfully');
      router.push('/admin/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Server error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07171a] px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-4xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-teal-200/90">Account Recovery</p>
          <h1 className="mt-3 font-serif text-4xl text-white/90">Forgot Password</h1>
          <p className="mt-4 text-sm leading-7 text-white/60">Recover your admin account in three secure steps. Verification codes expire quickly and can only be used once.</p>

          <div className="mt-8 space-y-4">
            <InfoRow title="Step 1" text="Request a verification code to your admin email" active={step === 1} complete={step > 1} />
            <InfoRow title="Step 2" text="Verify the 6-digit code from your inbox" active={step === 2} complete={step > 2} />
            <InfoRow title="Step 3" text="Set a new secure password" active={step === 3} complete={false} />
          </div>
        </section>

        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-semibold text-white/85">Recovery Form</p>
            <Link href="/admin/login" className="text-sm text-white/60 underline hover:text-white/80 transition">
            Back to login
          </Link>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-2">
            <StepPill index={1} currentStep={step} label="Email" />
            <StepPill index={2} currentStep={step} label="Verify" />
            <StepPill index={3} currentStep={step} label="Password" />
          </div>

          {step === 1 && (
            <form onSubmit={requestCode} className="space-y-4">
              <InputLabel label="Admin Email" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#041114]/60 px-4 py-2 text-white/90 placeholder-white/30 focus:border-teal-300/50 focus:outline-none"
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-teal-300 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send verification code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyCode} className="space-y-4">
              <InputLabel label="Verification Code" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#041114]/60 px-4 py-2 text-white/90 placeholder-white/30 focus:border-teal-300/50 focus:outline-none"
                placeholder="Enter 6-digit code"
                required
                disabled={isLoading}
              />

              <p className="text-xs text-white/45">Use the latest code sent to your inbox. Requesting a new code invalidates previous codes.</p>

              <button
                type="button"
                onClick={requestCode}
                disabled={isLoading}
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85"
              >
                Resend code
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-teal-300 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify code'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={resetPassword} className="space-y-4">
              <InputLabel label="New Password" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#041114]/60 px-4 py-2 text-white/90 placeholder-white/30 focus:border-teal-300/50 focus:outline-none"
                placeholder="Minimum 8 characters"
                required
                disabled={isLoading}
              />

              <InputLabel label="Confirm New Password" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#041114]/60 px-4 py-2 text-white/90 placeholder-white/30 focus:border-teal-300/50 focus:outline-none"
                placeholder="Re-enter new password"
                required
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-teal-300 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

function InfoRow({ title, text, active, complete }: { title: string; text: string; active: boolean; complete: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? 'border-teal-300/50 bg-white/10' : 'border-white/10 bg-[#041114]/45'}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{title}</p>
      <p className="mt-2 text-sm text-white/75">{text}</p>
      <p className={`mt-2 text-xs uppercase tracking-[0.18em] ${complete ? 'text-teal-200' : active ? 'text-white/70' : 'text-white/35'}`}>
        {complete ? 'Completed' : active ? 'In progress' : 'Pending'}
      </p>
    </div>
  );
}

function StepPill({ index, currentStep, label }: { index: Step; currentStep: Step; label: string }) {
  const isActive = index === currentStep;
  const isComplete = index < currentStep;

  return (
    <div
      className={`rounded-full border px-3 py-2 text-center text-xs uppercase tracking-[0.22em] ${
        isActive
          ? 'border-teal-300/60 bg-teal-300/15 text-teal-100'
          : isComplete
            ? 'border-white/20 bg-white/10 text-white/85'
            : 'border-white/10 bg-white/5 text-white/45'
      }`}
    >
      {label}
    </div>
  );
}

function InputLabel({ label }: { label: string }) {
  return <label className="block text-xs font-medium uppercase tracking-[0.26em] text-white/50">{label}</label>;
}
