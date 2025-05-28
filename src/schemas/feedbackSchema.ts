import {z} from 'zod';

export const feedbackSchema = z.object({
    message : z
    .string()
    .trim()
    .min(1, { message: 'feedback is required' })
});