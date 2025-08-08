import { z } from 'zod';

export const signupSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const adminCreateUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        role: z.enum(['customer', 'admin']).optional(),
        isBanned: z.boolean().optional(),
    }),
});

export const adminUpdateUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
        lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
        email: z.string().email('Invalid email address').optional(),
        role: z.enum(['customer', 'admin']).optional(),
        isBanned: z.boolean().optional(),
    }),
});