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
            { name: 'UltraWide 4K Monitor', category: 'Electronics', price: 799.5, stock: 45 },
            { name: 'Organic Cotton T-Shirt', category: 'Apparel', price: 29.5, stock: 250 },
            { name: 'Premium Denim Jeans', category: 'Apparel', price: 89.9, stock: 120 },
            { name: 'Running Shoes X-Pro', category: 'Footwear', price: 99.99, stock: 80 },
            { name: 'Leather Ankle Boots', category: 'Footwear', price: 150.0, stock: 60 },
            { name: '"The Art of Code" Book', category: 'Books', price: 45.0, stock: 200 },
            { name: 'Espresso Machine', category: 'Home Goods', price: 250.0, stock: 50 },
            { name: 'Yoga Mat', category: 'Sports', price: 35.0, stock: 150 },
        ];
        const createdProducts = await ProductModel.insertMany(productsToSeed);
        console.log(`${createdProducts.length} products created.`);

        const usersToSeed = [
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'adminpassword',
                role: 'admin',
                isBanned: false,
            },
            {
                firstName: 'Jane',
                lastName: 'Customer',
                email: 'jane.customer@example.com',
                password: 'password123',
                role: 'customer',
                isBanned: false,
            },
            {
                firstName: 'Alex',
                lastName: 'Johnson',
                email: 'alex.j@example.com',
                password: 'password789',
                role: 'customer',
                isBanned: false,
            },
            {
                firstName: 'Banned',
                lastName: 'User',
                email: 'banned@example.com',
                password: 'bannedpassword',
                role: 'customer',
                isBanned: true,
            },
            {
                firstName: 'Michael',
                lastName: 'Brown',
                email: 'michael.b@example.com',
                password: 'password202',
                role: 'customer',
                isBanned: false,
            },
        ];

        console.log('Creating users one by one to ensure password hashing...');
        const createdUsers = [];
        for (const userData of usersToSeed) {
            const user = await UserModel.create(userData);
            createdUsers.push(user);
        }
        console.log(`${createdUsers.length} users created.`);

        const ordersToSeed = [
            {
                user: createdUsers[1]._id,
                productsPurchased: [
                    { product: createdProducts[0]._id, quantity: 1 },
                    { product: createdProducts[1]._id, quantity: 1 },
                ],
                totalAmount: createdProducts[0].price + createdProducts[1].price,
            },
            {
                user: createdUsers[2]._id,
                productsPurchased: [{ product: createdProducts[3]._id, quantity: 3 }],
                totalAmount: createdProducts[3].price * 3,
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
