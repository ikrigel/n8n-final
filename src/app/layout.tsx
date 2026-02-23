import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'POLO BANANA - Production Ready App',
  description: 'A comprehensive single page application with authentication and full features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
