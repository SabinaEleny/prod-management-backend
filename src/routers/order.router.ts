import { Response, Router } from 'express';
import { BaseRouter } from './base.router';
import { OrderService } from '../services/order.service';
import { OrderDocument } from '../models/order.model';
import { validate } from '../middlewares/validation';
import { createOrderSchema } from '../schemas/order.schema';
import { AuthRequest, protect, isOrderOwner } from '../middlewares/auth';

export class OrderRouter extends BaseRouter<OrderDocument, OrderService> {
    constructor(router: Router) {
        super(router, new OrderService(), 'Order');
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.get('/orders', protect(), this.getAll.bind(this));
        this.router.post('/orders', protect(), validate(createOrderSchema), this.create.bind(this));
        this.router.get('/orders/:id', protect(), this.checkOwnership, this.getById.bind(this));
        this.router.put('/orders/:id', protect(), this.checkOwnership, this.update.bind(this));
        this.router.delete('/orders/:id', protect(), this.checkOwnership, this.delete.bind(this));
    }

    private checkOwnership(req: AuthRequest, res: Response, next: any) {
        if (req.user && req.user.role === 'admin') {
            return next();
        }
        return isOrderOwner(req, res, next);
    }

    public async create(req: AuthRequest, res: Response): Promise<Response> {
        const result = await this.service.create(req.body, req.user!);
        if (result && 'error' in result) {
            const statusCode = result.error.startsWith('Forbidden') ? 403 : 400;
            return res.status(statusCode).json({ message: result.error });
        }
        return res.status(201).json(result);
    }

    public async getAll(req: AuthRequest, res: Response): Promise<Response> {
        const items = await this.service.getAll(req.user!);
        return res.status(200).json(items);
    }
}
