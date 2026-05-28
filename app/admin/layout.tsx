'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicAuthPage = pathname === '/admin/login' || pathname === '/admin/forgot-password';

  return (
    <SessionProvider>
      {isPublicAuthPage ? (
        <>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#041114',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
              },
            }}
          />
        </>
      ) : (
        <div className="flex h-screen bg-[#07171a]">
          <AdminSidebar />
          <main className="flex-1 overflow-auto pt-14 md:pt-0">
            {children}
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#041114',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
              },
            }}
          />
        </div>
      )}
    </SessionProvider>
  );
}
