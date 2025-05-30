import { Eye, EyeOff } from 'lucide-react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthFormFieldProps<T extends FieldValues> {
  label: string;
  id: Path<T>;
  type?: 'text' | 'email' | 'password';
  placeholder: string;
  error?: string;
  register: UseFormRegister<T>;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export function AuthFormField<T extends FieldValues>({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  register,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
}: AuthFormFieldProps<T>) {
  return (
    <div className="flex flex-col gap-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          {...register(id)}
          id={id}
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          className="placeholder:text-gray-500"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-2.5 right-2 text-gray-400"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
