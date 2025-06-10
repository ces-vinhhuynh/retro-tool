import { z } from 'zod';

import { MESSAGES } from '@/utils/constant';

export const customTemplateSchema = z.object({
  templateName: z.string().min(1, MESSAGES.REQUIRED_FIELD),
  description: z.string().min(1, MESSAGES.REQUIRED_FIELD),
  questions: z
    .array(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1, MESSAGES.REQUIRED_FIELD),
        section: z.string().min(1, MESSAGES.REQUIRED_FIELD),
        description: z.string().min(1, MESSAGES.REQUIRED_FIELD),
      }),
    )
    .min(1, MESSAGES.REQUIRED_FIELD),
});

export type CustomTemplateSchemaType = z.infer<typeof customTemplateSchema>;
