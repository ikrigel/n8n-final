'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout wrapper with Material UI sidebar navigation
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <Box className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden">
      {/* Andy Warhol Banana Pop-Art Background */}
      <div className="warhol-bg" />

      {/* Additional decorative emoji elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-3">
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
        <div className="absolute top-20 right-20 text-9xl select-none">🍌</div>
        <div className="absolute bottom-20 left-20 text-9xl select-none">🐕</div>
      </div>

      <Sidebar>
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10 w-full">
          {children}
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2026 POLO BANANA. All rights reserved.</p>
          </div>
        </footer>
      </Sidebar>
    </Box>
  );
}
