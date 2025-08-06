import { Order, OrderDocument } from '../models/order.model';
import { OrderRepository } from '../repositories/order.repository';
import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';
import { UpdateQuery } from 'mongoose';
import { BaseServiceType } from './base.service';

type OrderCreationDTO = {
    userId: string;
    products: {
        id: string;
        quantity: number;
    }[];
};

export class OrderService implements BaseServiceType<OrderDocument>{
    private readonly orderRepository: OrderRepository;
    private readonly userRepository: UserRepository;
    private readonly productRepository: ProductRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
        this.userRepository = new UserRepository();
        this.productRepository = new ProductRepository();
    }

    public async getAll(_query?: any): Promise<OrderDocument[]> {
        return this.orderRepository.getAll();
    }

    public async getById(id: string): Promise<OrderDocument | undefined> {
        const order = await this.orderRepository.getById(id);
        return order ?? undefined;
    }


    public async create(orderData: OrderCreationDTO): Promise<OrderDocument | { error: string }> {
        const user = await this.userRepository.getById(orderData.userId);
        if (!user) {
            return { error: `User with ID ${orderData.userId} not found.` };
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

    public async update(id: string, data: any): Promise<OrderDocument | undefined> {
        console.log(`Updating order ${id} is not implemented yet.`);
        return undefined;
    }


    public async delete(id: string): Promise<OrderDocument | undefined> {
        const order = await this.orderRepository.delete(id);
        return order ?? undefined;
    }
}