import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import { MuiProvider } from '@/components/providers/MuiProvider';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'POLO BANANA - Production Ready App',
  description: 'A comprehensive single page application with authentication and full features',
  icons: {
    icon: '/favicon.svg',
  },
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
          <MuiProvider>
            <Layout>{children}</Layout>
          </MuiProvider>
        </Providers>
      </body>
    </html>
  );
}
