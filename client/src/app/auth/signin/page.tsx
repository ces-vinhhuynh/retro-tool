'use client';

import { CardContent } from '@/components/ui/card';
import { AuthCard } from '@/features/auth/components/auth-card';
import { GoogleSignInButton } from '@/features/auth/components/google-signin-button';
import { useSocialAuth } from '@/features/auth/hooks/use-social-auth';

export default function SignInPage() {
  const { signInWithGoogle, isSigningInWithGoogle } = useSocialAuth();

  return (
    <AuthCard
      title="Retro Health Check"
      description="Sign in to access your account"
    >
      <CardContent>
        <GoogleSignInButton
          isLoading={isSigningInWithGoogle}
          onClick={signInWithGoogle}
        />
      </CardContent>
    </AuthCard>
  );
}
