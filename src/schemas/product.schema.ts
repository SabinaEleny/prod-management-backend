import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        category: z.string(),
        price: z.number().positive('Price must be positive'),
        stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    }),
});

export const updateProductSchema = z.object({
    body: createProductSchema.shape.body.partial(),
});