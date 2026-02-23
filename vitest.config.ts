import { defineConfig } from 'vitest/config';
import path from 'path';

// Configuration for Vitest unit and integration tests
export default defineConfig({
  test: {
    // Use jsdom for DOM testing (browser-like environment)
    environment: 'jsdom',
    // Enable global test API (describe, it, expect, etc)
    globals: true,
    // Support CSS imports in tests
    css: true,
    // Setup file for jest-dom matchers
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    // Enable @/ alias for absolute imports
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
