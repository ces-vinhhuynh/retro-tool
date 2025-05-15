import { z } from 'zod';

export const teamSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(1, 'Team name is required')
    .max(50, 'Team name is too long'),
});
export type TeamFormValues = z.infer<typeof teamSchema>;
