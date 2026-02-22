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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 N8N SPA Frontend. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
