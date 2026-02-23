import type { Metadata } from 'next';
import { Providers } from '@/components/providers/Providers';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'N8N SPA - Image & Video Generator',
  description: 'Frontend for n8n automation workflows',
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
