'use client';

import React from 'react';
import NavBar from './NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout wrapper with navigation and theming
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-10 dark:opacity-5">
        {/* You can add background images here: */}
        {/*
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundImage: 'url(/images/banana.png)',
            backgroundSize: 'cover',
            top: '10%',
            right: '5%',
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundImage: 'url(/images/polo.png)',
            backgroundSize: 'cover',
            bottom: '10%',
            left: '5%',
          }}
        />
        */}
        <div className="absolute top-10 right-10 text-9xl opacity-20 select-none">🍌</div>
        <div className="absolute bottom-10 left-10 text-9xl opacity-20 select-none">🐕</div>
      </div>

      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 POLO BANANA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
