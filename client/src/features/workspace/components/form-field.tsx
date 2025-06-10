'use client';

import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps<T extends FieldValues> {
  id: string;
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
}

export function FormField<T extends FieldValues>({
  id,
  label,
  name,
  register,
  errors,
  placeholder,
  required = false,
  type = 'text',
}: FormFieldProps<T>) {
  return (
    <div className="grid gap-3">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        type={type}
        {...register(name)}
        placeholder={placeholder}
        required={required}
      />
      {errors?.[name] && (
        <span className="text-xs text-red-500">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}
