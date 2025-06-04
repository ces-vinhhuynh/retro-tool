import { z } from 'zod';

export const inviteViaEmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export type InviteViaEmailSchema = z.infer<typeof inviteViaEmailSchema>;