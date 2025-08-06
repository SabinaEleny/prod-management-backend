import { BaseRouter } from './base.router';
import { OrderService } from '../services/order.service';
import { OrderDocument } from '../models/order.model';
import { validate } from '../middlewares/validation.handler';
import { createOrderSchema } from '../schemas/order.schema';

export class OrderRouter extends BaseRouter<OrderDocument, OrderService> {
    constructor() {
        super(new OrderService(), 'Order');
    }

    protected initializeRoutes(): void {
        super.initializeRoutes();
        this.router.post(`/`, validate(createOrderSchema), this.create.bind(this));
    }
}