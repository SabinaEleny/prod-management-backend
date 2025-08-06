import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../database';
import { ProductModel } from '../models/product.model';
import { UserModel } from '../models/user.model';
import { OrderModel } from '../models/order.model';

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Seeding database...');

        console.log('Removing old data...');
        await OrderModel.deleteMany({});
        await ProductModel.deleteMany({});
        await UserModel.deleteMany({});
        console.log('Old data removed successfully.');

        const productsToSeed = [
            { name: 'Laptop Pro X1', category: 'Electronics', price: 1499.99, stock: 30 },
            { name: 'Mechanical Keyboard RGB', category: 'Electronics', price: 120, stock: 100 },
            { name: 'UltraWide 4K Monitor', category: 'Electronics', price: 799.50, stock: 45 },
            { name: 'Organic Cotton T-Shirt', category: 'Apparel', price: 29.5, stock: 250 },
            { name: 'Premium Denim Jeans', category: 'Apparel', price: 89.90, stock: 120 },
            { name: 'Running Shoes X-Pro', category: 'Footwear', price: 99.99, stock: 80 },
            { name: 'Leather Ankle Boots', category: 'Footwear', price: 150.00, stock: 60 },
            { name: '"The Art of Code" Book', category: 'Books', price: 45.00, stock: 200 },
            { name: 'Espresso Machine', category: 'Home Goods', price: 250.00, stock: 50 },
            { name: 'Yoga Mat', category: 'Sports', price: 35.00, stock: 150 },
        ];
        const createdProducts = await ProductModel.insertMany(productsToSeed);
        console.log(`${createdProducts.length} products created.`);

        const usersToSeed = [
            { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' },
            { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: 'password456' },
            { firstName: 'Alex', lastName: 'Johnson', email: 'alex.j@example.com', password: 'password789' },
            { firstName: 'Emily', lastName: 'White', email: 'emily.white@example.com', password: 'password101' },
            { firstName: 'Michael', lastName: 'Brown', email: 'michael.b@example.com', password: 'password202' },
        ];
        const createdUsers = await UserModel.insertMany(usersToSeed);
        console.log(`${createdUsers.length} users created.`);

        const ordersToSeed = [
            {
                user: createdUsers[0]._id,
                productsPurchased: [
                    { product: createdProducts[0]._id, quantity: 1 },
                    { product: createdProducts[2]._id, quantity: 1 },
                ],
                totalAmount: createdProducts[0].price * 1 + createdProducts[2].price * 1,
            },
            {
                user: createdUsers[1]._id,
                productsPurchased: [
                    { product: createdProducts[3]._id, quantity: 5 },
                    { product: createdProducts[4]._id, quantity: 2 },
                ],
                totalAmount: createdProducts[3].price * 5 + createdProducts[4].price * 2,
            },
            {
                user: createdUsers[0]._id,
                productsPurchased: [
                    { product: createdProducts[9]._id, quantity: 2 },
                ],
                totalAmount: createdProducts[9].price * 2,
            },
            {
                user: createdUsers[2]._id,
                productsPurchased: [
                    { product: createdProducts[7]._id, quantity: 1 },
                    { product: createdProducts[1]._id, quantity: 1 },
                ],
                totalAmount: createdProducts[7].price * 1 + createdProducts[1].price * 1,
            },
            {
                user: createdUsers[3]._id,
                productsPurchased: [
                    { product: createdProducts[8]._id, quantity: 1 },
                ],
                totalAmount: createdProducts[8].price * 1,
            },
            {
                user: createdUsers[4]._id,
                productsPurchased: [
                    { product: createdProducts[5]._id, quantity: 1 },
                    { product: createdProducts[6]._id, quantity: 1 },
                    { product: createdProducts[9]._id, quantity: 3 },
                ],
                totalAmount: createdProducts[5].price * 1 + createdProducts[6].price * 1 + createdProducts[9].price * 3,
            },
        ];
        const createdOrders = await OrderModel.insertMany(ordersToSeed);
        console.log(`${createdOrders.length} orders created.`);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedDatabase();