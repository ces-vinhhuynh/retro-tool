'use client';

import { Loader2 } from 'lucide-react';

export const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin" />
    </div>
  );
};
