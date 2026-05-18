'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import AdminTextarea from '@/components/admin/AdminTextarea';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

const SettingsSchema = z.object({
  partnershipEmail: z.string().email('Invalid email'),
  tagline: z.string().min(1, 'Tagline is required'),
  siteUrl: z.string().url('Invalid URL'),
  analyticsId: z.string().optional(),
});

type SettingsFormData = z.infer<typeof SettingsSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsSchema),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/settings');
      const data = await res.json();

      setValue('partnershipEmail', data.partnershipEmail);
      setValue('tagline', data.tagline);
      setValue('siteUrl', data.siteUrl);
      setValue('analyticsId', data.analyticsId || '');
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: SettingsFormData) {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save settings');
      }

      toast.success('Settings updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-white/90">Settings</h1>
        <p className="text-white/50 mt-2">Manage global site settings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 border border-white/10 rounded-[2.25rem] p-8 backdrop-blur-sm space-y-6">
        <AdminInput
          label="Partnership Email"
          type="email"
          {...register('partnershipEmail')}
          error={errors.partnershipEmail?.message}
          required
        />

        <AdminTextarea
          label="Tagline"
          rows={2}
          {...register('tagline')}
          error={errors.tagline?.message}
          required
        />

        <AdminInput
          label="Site URL"
          type="url"
          {...register('siteUrl')}
          error={errors.siteUrl?.message}
          required
        />

        <AdminInput
          label="Analytics ID (optional)"
          placeholder="UA-xxxxxxxxx"
          {...register('analyticsId')}
          error={errors.analyticsId?.message}
        />

        <div className="flex gap-4 pt-4 border-t border-white/10">
          <AdminButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </AdminButton>
        </div>
      </form>

      <div className="mt-8 bg-white/5 border border-white/10 rounded-[2.25rem] p-6">
        <h2 className="text-white/90 font-semibold mb-2">Password Management</h2>
        <p className="text-white/50 text-sm mb-6">Change your password securely while signed in. Recovery is available separately if you cannot log in.</p>

        <ChangePasswordFlowCard />
      </div>
    </div>
  );
}

function ChangePasswordFlowCard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordChecks = [
    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
    { label: 'Contains a number', valid: /\d/.test(newPassword) },
    { label: 'Contains a letter', valid: /[a-zA-Z]/.test(newPassword) },
    { label: 'Matches confirmation', valid: newPassword.length > 0 && newPassword === confirmPassword },
  ];

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Complete all password fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Server error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#07171a]/40 p-5">
      <form onSubmit={onChangePassword} className="space-y-4">
        <AdminInput
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <AdminInput
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <AdminInput
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
          {passwordChecks.map((check) => (
            <p key={check.label} className={`text-xs uppercase tracking-[0.18em] ${check.valid ? 'text-teal-200' : 'text-white/45'}`}>
              {check.valid ? 'Passed' : 'Pending'} - {check.label}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <AdminButton type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Updating Password...' : 'Change Password'}
          </AdminButton>
          <Link
            href="/admin/forgot-password"
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
          >
            Open Recovery Flow
          </Link>
        </div>
      </form>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#041114]/70 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45 mb-2">Security note</p>
        <p className="text-sm text-white/65">Use <span className="text-white/85">Forgot Password</span> only when you cannot access your account. This in-session flow verifies your current password before applying updates.</p>
      </div>
    </div>
  );
}
