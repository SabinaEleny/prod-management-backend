import { OrderModel, OrderDocument, Order } from '../models/order.model';
import { Types } from 'mongoose';

export class OrderRepository {
    public async getAll(userId?: Types.ObjectId): Promise<OrderDocument[]> {
        const query: any = {};
        if (userId) {
            query.user = userId;
        }
        return OrderModel.find(query);
    }

    public async getById(id: string): Promise<OrderDocument | null> {
        return OrderModel.findById(id);
    }

    public async create(orderData: Order): Promise<OrderDocument> {
        const newOrder = await OrderModel.create(orderData);
        return newOrder.populate(['user', 'productsPurchased.product']);
    }

    public async delete(id: string): Promise<OrderDocument | null> {
        return OrderModel.findByIdAndDelete(id);
    }
}
