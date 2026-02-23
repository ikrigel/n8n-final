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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="card space-y-6">
          {/* Logo / Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">POLO BANANA</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account
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
              <span className="text-blue-600 dark:text-blue-400">
                One will be created for you on first sign-in
              </span>
            </p>
          </div>

          {/* Features List */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold">
              After signing in, you can:
            </p>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>✓ Generate images and videos</li>
              <li>✓ Manage your media gallery</li>
              <li>✓ Configure logging & webhooks</li>
              <li>✓ Access all features</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Your data is secure and only used for authentication
        </p>
      </div>
    </div>
  );
}
