import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.handler';

type AsyncHandler = (req: Request | AuthRequest, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncHandler) => (req: Request | AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};