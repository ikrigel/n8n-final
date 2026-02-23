'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useUserSession } from '@/hooks/useSession';
import React, { useEffect } from 'react';

/**
 * Client-side auth guard for protected routes
 * Redirects unauthenticated users to sign-in page
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUserSession();

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/error', '/help', '/about', '/api/auth'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    // Skip auth check for public routes
    if (isPublicRoute) return;

    // Wait for session to load
    if (isLoading) return;

    // Redirect to sign-in if not authenticated and accessing protected route
    if (!isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, isPublicRoute, router]);

  // Show loading state while checking authentication
  if (!isPublicRoute && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect is happening - show nothing until redirect completes
  if (!isPublicRoute && !isAuthenticated && !isLoading) {
    return null;
  }

  return <>{children}</>;
}
