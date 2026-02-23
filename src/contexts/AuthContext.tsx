'use client';

import React, { createContext, useContext } from 'react';
import { useUserSession } from '@/hooks/useSession';

interface AuthContextType {
  userId: string;
  userEmail: string;
  userName: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { userId, userEmail, userName, isAuthenticated, isLoading } =
    useUserSession();

  // Provide fallback values for testing/demo
  const value = {
    userId: userId || 'guest',
    userEmail: userEmail || 'user@example.com',
    userName: userName || 'Guest User',
    isAuthenticated: isAuthenticated || false,
    isLoading: isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
