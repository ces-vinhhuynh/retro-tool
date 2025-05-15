'use client';

import { ReactNode } from 'react';

import { Header } from './header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto max-w-screen-2xl flex-grow px-4 py-8">
        {children}
      </main>
    </div>
  );
}
