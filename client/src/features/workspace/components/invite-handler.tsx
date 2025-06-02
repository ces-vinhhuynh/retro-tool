'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface InviteHandlerProps {
  isLoading: boolean;
  error: string | null;

  children?: React.ReactNode;
}

const InviteHandler = ({ isLoading, error, children }: InviteHandlerProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-lg">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push('/')}>
                Go to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default InviteHandler;
