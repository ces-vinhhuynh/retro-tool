'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { AuthCard } from '@/features/auth/components/auth-card';
import { AuthFormField } from '@/features/auth/components/auth-form-field';
import { useForgotPassword } from '@/features/auth/hooks/use-forgot-password';
import {
  ForgotPasswordInputs,
  forgotPasswordSchema,
} from '@/features/auth/schemas/auth.schema';

export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPasswordPending, isSuccess } =
    useForgotPassword();
  const { register, handleSubmit } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <>
      {isSuccess && (
        <AuthCard
          title="Check your email"
          description="We've sent you a link to reset your password"
        >
          <CardContent>
            <p className="text-muted-foreground text-sm">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </AuthCard>
      )}
      <AuthCard
        title="Reset Your Password"
        description="Type in your email and we'll send you a link to reset your password"
      >
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => forgotPassword(data.email))}
            className="flex flex-col gap-y-4"
          >
            <AuthFormField
              label="Email"
              id="email"
              type="email"
              placeholder="Enter your email address"
              register={register}
            />
            <Button
              type="submit"
              disabled={isForgotPasswordPending}
              className="bg-ces-orange-500 hover:bg-ces-orange-600 w-full text-white"
            >
              {isForgotPasswordPending ? 'Sending...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-secondary text-sm">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="text-ces-orange-500 hover:text-ces-orange-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </AuthCard>
    </>
  );
}
