import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#1f2937',
        'primary-light': '#ffffff',
        'secondary-dark': '#111827',
        'secondary-light': '#f9fafb',
        'accent': '#3b82f6',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;
