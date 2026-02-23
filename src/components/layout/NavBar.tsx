'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

/**
 * Navigation bar with hamburger menu and professional styling
 */
export default function NavBar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { userName, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const navLinks = [
    { href: '/', label: '🏠 Home' },
    { href: '/generate/image', label: '🎨 Generate Image' },
    { href: '/generate/video', label: '🎬 Generate Video' },
    { href: '/gallery', label: '🖼️ Gallery' },
    { href: '/logs', label: '📝 Logs' },
    { href: '/settings', label: '⚙️ Settings' },
    { href: '/about', label: 'ℹ️ About' },
    { href: '/help', label: '❓ Help' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b-2 border-amber-200 dark:border-amber-900/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2"
          >
            🍌 POLO BANANA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Theme Toggle, User Menu, Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* User Menu */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border-2 border-amber-200 dark:border-amber-900/40"
                  title={userName || 'User'}
                  aria-label="User menu"
                >
                  <span className="text-xl">👤</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-xl shadow-xl border-2 border-amber-200 dark:border-amber-900/40 z-50">
                    <div className="px-4 py-4 border-b-2 border-amber-100 dark:border-amber-900/30">
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold uppercase">
                        Signed in as
                      </p>
                      <p className="font-bold text-amber-600 dark:text-amber-400 truncate mt-1">{userName}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-semibold transition-colors border-t-2 border-amber-100 dark:border-amber-900/30"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border-2 border-amber-200 dark:border-amber-900/40"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t-2 border-amber-200 dark:border-amber-900/40 bg-gradient-to-b from-white dark:from-gray-800 to-amber-50 dark:to-gray-900">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors rounded-lg my-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
