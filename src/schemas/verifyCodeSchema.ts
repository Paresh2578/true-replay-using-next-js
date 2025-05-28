import { z } from 'zod';

export const verifyCodeSchema = z.object({
  verifyCode: z.string().length(6, { message: "OTP must be 6 digits" })
});
