import { BaseServiceType } from './base.service';
import { Order, OrderDocument } from '../models/order.model';
import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { UpdateQuery } from 'mongoose';
import { UserDocument } from '../models/user.model';

type OrderCreationDTO = {
    products: { id: string; quantity: number; }[];
};

export class OrderService implements BaseServiceType<OrderDocument> {
    private readonly orderRepository: OrderRepository;
    private readonly productRepository: ProductRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
        this.productRepository = new ProductRepository();
    }

    public async getAll(user: UserDocument): Promise<OrderDocument[]> {
        if (user.role === 'admin') {
            return this.orderRepository.getAll();
        } else {
            return this.orderRepository.getAll(user._id);
        }
    }

    public async getById(id: string): Promise<OrderDocument | undefined> {
        const order = await this.orderRepository.getById(id);
        return order ?? undefined;
    }

    public async create(orderData: OrderCreationDTO, user: UserDocument): Promise<OrderDocument | { error: string }> {
        if (user.isBanned) {
            return { error: 'Forbidden: Banned users cannot place orders.' };
        }

        let totalAmount = 0;
        const productsPurchased = [];

        for (const item of orderData.products) {
            const product = await this.productRepository.getById(item.id);

            if (!product) {
                return { error: `Product with ID ${item.id} not found.` };
            }
            if (product.stock < item.quantity) {
                return { error: `Not enough stock for "${product.name}".` };
            }

            totalAmount += product.price * item.quantity;
            productsPurchased.push({ product: product._id, quantity: item.quantity });
        }

        const newOrderData: Order = {
            user: user._id,
            productsPurchased,
            totalAmount,
        };

        for (const item of orderData.products) {
            const updateQuery: UpdateQuery<any> = { $inc: { stock: -item.quantity } };
            await this.productRepository.update(item.id, updateQuery);
        }

        return this.orderRepository.create(newOrderData);
    }

    public async update(id: string, _data: any): Promise<OrderDocument | undefined> {
        console.log(`Updating order ${id} is not implemented yet.`);
        return undefined;
    }

    public async delete(id: string): Promise<OrderDocument | undefined> {
        const order = await this.orderRepository.delete(id);
        return order ?? undefined;
    }
}