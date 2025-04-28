'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import supabaseClient from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const next = params.get('next') || '/';

      if (code) {
        try {
          await supabaseClient.auth.exchangeCodeForSession(code);
          queryClient.invalidateQueries();
          router.replace(next);
        } catch (error) {
          console.error('OAuth callback error:', error);
        }
      }
    };

    handleOAuthRedirect();
  }, [router, queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
