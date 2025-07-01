'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { AuthCard } from '@/features/auth/components/auth-card';
import { AuthFormField } from '@/features/auth/components/auth-form-field';
import { useUpdatePassword } from '@/features/auth/hooks/use-update-password';
import {
  UpdatePasswordInputs,
  updatePasswordSchema,
} from '@/features/auth/schemas/auth.schema';

export default function UpdatePasswordPage() {
  const { updatePassword, isPending } = useUpdatePassword();
  const { register, handleSubmit } = useForm<UpdatePasswordInputs>({
    resolver: zodResolver(updatePasswordSchema),
  });

  return (
    <AuthCard title="Update Password" description="Update your password">
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => updatePassword(data.password))}
          className="flex flex-col gap-y-4"
        >
          <AuthFormField
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            register={register}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full text-white"
          >
            {isPending ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </AuthCard>
  );
}
