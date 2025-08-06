import { OrderModel, OrderDocument, Order } from '../models/order.model';

export class OrderRepository {

    public async getAll(): Promise<OrderDocument[]> {
        return OrderModel.find({});
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