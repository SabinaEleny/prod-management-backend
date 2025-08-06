import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e) {
        if (e instanceof ZodError) {
            const errors = e.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));
            return res.status(400).json({ errors });
        }
        next(e);
    }
};