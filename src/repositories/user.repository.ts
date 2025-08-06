import { UserModel, UserDocument, User } from '../models/user.model';
import { ClientSession } from 'mongoose';

export class UserRepository {
    public async getAll(): Promise<UserDocument[]> {
        return UserModel.find({}).select('-password') as Promise<UserDocument[]>;
    }

    public async getById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id).select('-password') as Promise<UserDocument | null>;
    }

    public async getByEmail(email: string): Promise<UserDocument | null> {
        return UserModel.findOne({email: email.toLowerCase()});
    }

    public async create(userData: User): Promise<UserDocument> {
        return UserModel.create(userData);
    }

    public async update(id: string, userData: Partial<User>): Promise<UserDocument | null> {
        return UserModel.findByIdAndUpdate(id, userData, {new: true}).select('-password') as Promise<UserDocument | null>;
    }

    public async delete(id: string, options?: { session: ClientSession }): Promise<UserDocument | null> {

        return UserModel.findByIdAndDelete(id, options).select('-password').exec();
    }
}