import type { Metadata } from 'next';

import { ReactQueryProvider } from '@/components/react-query-provider';
import { Toaster } from '@/components/ui/sonner';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Project Health Mate',
  description: 'Project Health Mate - Code Engine Studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
