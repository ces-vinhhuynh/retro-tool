'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AuthCard } from '@/features/auth/components/auth-card';
import { AuthFormField } from '@/features/auth/components/auth-form-field';
import { GoogleSignInButton } from '@/features/auth/components/google-signin-button';
import { useSignUp } from '@/features/auth/hooks/use-signup';
import { useSocialAuth } from '@/features/auth/hooks/use-social-auth';
import {
  RegisterInputs,
  registerSchema,
} from '@/features/auth/schemas/auth.schema';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isSigningUp } = useSignUp();
  const { signInWithGoogle, isSigningInWithGoogle } = useSocialAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <AuthCard title="Create an account">
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => signUp(data))}
          className="flex flex-col gap-y-4"
        >
          <AuthFormField
            label="Full Name"
            id="full_name"
            type="text"
            placeholder="Enter your name"
            error={errors.full_name?.message}
            register={register}
          />

          <AuthFormField
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            register={register}
          />

          <AuthFormField
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            register={register}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <Button
            type="submit"
            className="bg-ces-orange-500 hover:bg-ces-orange-600 w-full text-white"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center">
            <span className="text-secondary bg-white px-2 text-sm">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleSignInButton
          isLoading={isSigningInWithGoogle}
          onClick={signInWithGoogle}
        />
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-secondary text-sm">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </AuthCard>
  );
}
