import { Request, Response, NextFunction } from 'express';

export type AppError = Error & {
    status?: number;
};

export const error = (err: AppError, req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};
