'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

/**
 * Hook to access NextAuth session
 * Provides user info and loading state
 */
export function useUserSession() {
  const { data: session, status, update } = useNextAuthSession();

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
    status,
    update,
    // Convenience getters
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    userName: session?.user?.name,
    userImage: session?.user?.image,
  };
}
