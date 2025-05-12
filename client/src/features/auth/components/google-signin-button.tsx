// src/features/auth/components/google-sign-in-button.tsx
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

interface GoogleSignInButtonProps {
  isLoading: boolean;
  onClick: () => void;
  text?: string;
}

export function GoogleSignInButton({
  isLoading,
  onClick,
  text,
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Image src="/google.svg" alt="Google" width={16} height={16} />
      )}
      {text || 'Sign in with Google'}
    </Button>
  );
}
