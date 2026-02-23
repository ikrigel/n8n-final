'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { LogsProvider } from '@/contexts/LogsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from './AuthGuard';

/**
 * Application providers wrapper
 * Combines all context providers and session management
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ConfigProvider>
        <LogsProvider>
          <AuthProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProvider>
        </LogsProvider>
      </ConfigProvider>
    </SessionProvider>
  );
}
