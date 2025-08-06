import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
    }),
});

export const updateUserSchema = z.object({
    body: createUserSchema.shape.body.pick({
        firstName: true,
        lastName: true,
        email: true
    }).partial(),
});