'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

/**
 * Sign-in page with Google OAuth button
 */
export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleGoogleSignIn = async () => {
    await signIn('google', {
      redirectTo: callbackUrl,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-10 dark:opacity-5">
        <div className="absolute top-20 right-10 text-9xl select-none">🍌</div>
        <div className="absolute bottom-20 left-10 text-9xl select-none">🐕</div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Card */}
        <div className="card space-y-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl">
          {/* Logo / Title */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              🍌 POLO BANANA
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
              Welcome back!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in to access your creative workspace
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
              <p className="font-bold">Authentication Error</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2">
                Please try again or contact support if the problem persists.
              </p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full btn-primary flex items-center justify-center gap-3 py-3 text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032 0-3.331 2.701-6.032 6.032-6.032 1.498 0 2.866 0.549 3.921 1.453v2.914h-2.294c-0.621-0.687-1.522-1.120-2.627-1.120-2.071 0-3.756 1.688-3.756 3.764 0 2.077 1.685 3.764 3.756 3.764 1.576 0 2.920-0.957 3.517-2.248h-3.517v-1.364h6.14v0.214c0 3.329-2.537 5.701-6.141 5.701-3.756 0-6.813-3.056-6.813-6.812s3.057-6.812 6.813-6.812c1.754 0 3.355 0.665 4.521 1.744v-2.949c-1.178-0.745-2.531-1.149-4.025-1.149-4.306 0-7.857 3.551-7.857 7.857 0 4.306 3.551 7.857 7.857 7.857 4.305 0 7.803-3.325 7.803-7.357 0-0.676-0.066-1.333-0.198-1.962z" />
            </svg>
            Sign in with Google
          </button>

          {/* Info Text */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Don't have an account?{' '}
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                One will be created for you on first sign-in
              </span>
            </p>
          </div>

          {/* Features List */}
          <div className="border-t-2 border-amber-200 dark:border-amber-900/40 pt-6">
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-4 font-bold uppercase tracking-wide">
              🎯 After signing in, you can:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-lg">🎨</span>
                <span>Generate stunning images and videos</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-lg">🖼️</span>
                <span>Manage your media gallery</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-lg">⚙️</span>
                <span>Configure logging & webhooks</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-lg">🔒</span>
                <span>Access all features securely</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 mt-8">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            🔐 Your data is secure and only used for authentication
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; 2026 POLO BANANA. Powered by Next.js + Vercel
          </p>
        </div>
      </div>
    </div>
  );
}
