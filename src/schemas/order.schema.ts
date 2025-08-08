import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const invalidIdMessage = 'Invalid ID format';

export const createOrderSchema = z.object({
    body: z.object({
        products: z
            .array(
                z.object({
                    id: z.string().regex(objectIdRegex, invalidIdMessage),
                    quantity: z.number().int().positive('Quantity must be a positive integer'),
                })
            )
            .nonempty('Products array cannot be empty'),
    }),
});