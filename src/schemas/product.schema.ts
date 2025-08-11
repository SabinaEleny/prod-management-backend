import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    category: z.string(),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
});

export const updateProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').optional(),
    category: z.string().optional(),
    price: z.number().positive('Price must be positive').optional(),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer').optional(),
});
