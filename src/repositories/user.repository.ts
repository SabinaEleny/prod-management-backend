import { ClientSession } from 'mongoose';
import { UserModel, UserDocument, User } from '../models/user.model';

export class UserRepository {
    public async getAll(): Promise<UserDocument[]> {
        return UserModel.find({});
    }

    public async getById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id);
    }

    public async getByEmail(email: string): Promise<UserDocument | null> {
        return UserModel.findOne({ email: email.toLowerCase() });
    }

    public async create(userData: User): Promise<UserDocument> {
        return UserModel.create(userData);
    }

    public async update(id: string, userData: Partial<User>): Promise<UserDocument | null> {
        return UserModel.findByIdAndUpdate(id, userData, { new: true });
    }

    public async delete(id: string, options?: { session: ClientSession }): Promise<UserDocument | null> {
        return UserModel.findByIdAndDelete(id, options);
    }
}
