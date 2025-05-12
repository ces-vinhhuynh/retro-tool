import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters long'),
});

export type LoginInputs = z.infer<typeof loginSchema>;
export type RegisterInputs = z.infer<typeof registerSchema>;
export type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInputs = z.infer<typeof updatePasswordSchema>;
