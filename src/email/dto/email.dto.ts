import { z } from 'zod';

export const verifyTokenSchema = z
  .object({
    token: z.string(),
  })
  .required();

export type VerifyTokenDto = z.infer<typeof verifyTokenSchema>;
