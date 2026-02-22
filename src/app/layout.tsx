import type { Metadata } from 'next';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { LogsProvider } from '@/contexts/LogsContext';
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
        <ConfigProvider>
          <LogsProvider>
            <Layout>{children}</Layout>
          </LogsProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
