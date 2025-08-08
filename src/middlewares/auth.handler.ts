import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, UserDocument } from '../models/user.model';
import { asyncHandler } from './async.handler';
import { OrderModel } from '../models/order.model';

export interface AuthRequest extends Request {
    user?: UserDocument;
}

export const isAuthenticated = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await UserModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden, admin access required' });
    }
};

export const isOrderOwner = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user!._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You are not the owner of this order' });
    }

    next();
});