import {z} from "zod";

export const usernameQuerySchema = z.object({
    username : z.string()
               .min(2,'Username must be at least 2 characters')
               .max(20, 'Username must be no more than 20 characters')
               .regex(/^[0-9a-zA-z]+$/, 'Username must not contain special characters')
})