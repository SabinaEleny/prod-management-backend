import { BaseServiceType } from './base.service';
import { User, UserDocument } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { OrderModel } from '../models/order.model';
import mongoose from 'mongoose';

export class UserService implements BaseServiceType<UserDocument> {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async getAll(_query?: any): Promise<UserDocument[]> {
        return this.userRepository.getAll();
    }

    public async getById(id: string): Promise<UserDocument | undefined> {
        const user = await this.userRepository.getById(id);
        return user ?? undefined;
    }

    public async create(userData: User): Promise<Partial<UserDocument> | { error: string }> {
        const existingUser = await this.userRepository.getByEmail(userData.email);
        if (existingUser) {
            return { error: 'Email is already in use.' };
        }

        const newUser = await this.userRepository.create(userData);
        const { password, ...userWithoutPassword } = newUser.toObject();
        return userWithoutPassword;
    }

    public async update(id: string, userData: Partial<User>): Promise<UserDocument | undefined> {
        const user = await this.userRepository.update(id, userData);
        return user ?? undefined;
    }

    public async delete(id: string): Promise<UserDocument | undefined> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await this.userRepository.delete(id, { session });

            if (!user) {
                await session.abortTransaction();
                return undefined;
            }

            await OrderModel.deleteMany({ user: id }, { session });

            await session.commitTransaction();

            return user;

        } catch (error) {
            await session.abortTransaction();
            console.error("Transaction aborted due to an error:", error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    public async banUser(id: string): Promise<UserDocument | undefined> {
        const user = await this.userRepository.update(id, { isBanned: true });
        return user ?? undefined;
    }

}