import type { Metadata } from 'next';

import { ReactQueryProvider } from '@/components/react-query-provider';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Retro Tool',
  description: 'Retro Tool - Code Engine Studio',
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
          <div className="px-10">{children}</div>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
