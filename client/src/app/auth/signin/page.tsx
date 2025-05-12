'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AuthCard } from '@/features/auth/components/auth-card';
import { AuthFormField } from '@/features/auth/components/auth-form-field';
import { GoogleSignInButton } from '@/features/auth/components/google-signin-button';
import { useSignIn } from '@/features/auth/hooks/use-signin';
import { useSocialAuth } from '@/features/auth/hooks/use-social-auth';
import { loginSchema, LoginInputs } from '@/features/auth/schemas/auth.schema';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithGoogle, isSigningInWithGoogle } = useSocialAuth();
  const { signInWithEmail, isSigningInWithEmail } = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  return (
    <AuthCard
      title="CES Retro Tool"
      description="Sign in to access your account"
    >
      <CardContent>
        <form
          onSubmit={handleSubmit((data: LoginInputs) => signInWithEmail(data))}
          className="flex flex-col gap-y-4"
        >
          <AuthFormField
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email address"
            error={errors.email?.message}
            register={register}
          />

          <AuthFormField
            label="Password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={errors.password?.message}
            register={register}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="rememberMe" {...register('rememberMe')} />
              <Label htmlFor="rememberMe" className="text-secondary text-sm">
                Remember me
              </Label>
            </div>

            <Link
              href="/auth/forgot-password"
              className="text-ces-orange-500 text-sm hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="bg-ces-orange-500 hover:bg-ces-orange-600 w-full text-white"
            disabled={isSigningInWithEmail}
          >
            {isSigningInWithEmail ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
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
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-ces-orange-500 font-medium">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </AuthCard>
  );
}
