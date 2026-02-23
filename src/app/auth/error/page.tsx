'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/**
 * Authentication error page
 */
export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    AccessDenied: 'Access was denied. Please check your credentials.',
    Callback: 'There was an error during the callback process.',
    OAuthSignin: 'Error connecting to OAuth provider.',
    OAuthCallback: 'Error in OAuth callback.',
    OAuthCreateAccount: 'Error creating account via OAuth.',
    EmailCreateAccount: 'Error creating email account.',
    CredentialsSignin: 'Invalid credentials provided.',
    default: 'An authentication error occurred. Please try again.',
  };

  const message = errorMessages[error as string] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="card text-center space-y-6">
          {/* Error Icon */}
          <div className="text-6xl">⚠️</div>

          {/* Title */}
          <h1 className="text-2xl font-bold">Authentication Error</h1>

          {/* Error Message */}
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            <p>{message}</p>
            {error && (
              <p className="text-xs mt-2 opacity-75">Error code: {error}</p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            This could happen if:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
            <li>✗ Your OAuth credentials are invalid</li>
            <li>✗ The OAuth provider is temporarily unavailable</li>
            <li>✗ There was a network connection error</li>
            <li>✗ Session has expired</li>
          </ul>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <Link href="/auth/signin" className="btn-primary block text-center">
              ← Back to Sign In
            </Link>
            <Link href="/" className="btn-secondary block text-center">
              ← Go to Home
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If the problem persists, please{' '}
            <span className="font-semibold">clear your browser cache</span> and
            try again.
          </p>
        </div>
      </div>
    </div>
  );
}
