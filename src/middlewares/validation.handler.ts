import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });

    if (!result.success) {
        const errors = result.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));

        return res.status(400).json({ errors });
    }

    next();
};