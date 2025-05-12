'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { AuthCard } from '@/features/auth/components/auth-card';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function SignInPage() {
  const { isLoading, signInWithGoogle } = useAuth();

  return (
    <AuthCard
      title="Retro Health Check"
      description="Sign in to access your account"
    >
      <CardContent className="py-4">
        <Button
          variant="outline"
          className="h-12 w-full"
          onClick={() => signInWithGoogle()}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="pr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="pr-2"
              />
              Sign in with Google
            </>
          )}
        </Button>
      </CardContent>
    </AuthCard>
  );
}
