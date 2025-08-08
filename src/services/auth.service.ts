import { UserModel, User, UserDocument } from '../models/user.model';
import jwt from 'jsonwebtoken';

export class AuthService {
    public async signup(userData: User): Promise<Partial<UserDocument> | { error: string }> {
        const existingUser = await UserModel.findOne({ email: userData.email });
        if (existingUser) {
            return { error: 'Email is already in use.' };
        }

        const newUser = await UserModel.create(userData);
        const { password, ...userWithoutPassword } = newUser.toObject();
        return userWithoutPassword;
    }

    public async login(email: string, pass: string): Promise<{ token: string; user: Partial<UserDocument> } | { error: string }> {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { error: 'Invalid credentials.' };
        }

        const isMatch = await user.comparePassword(pass);
        if (!isMatch) {
            return { error: 'Invalid credentials.' };
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        const { password, ...userWithoutPassword } = user.toObject();
        return { token, user: userWithoutPassword };
    }
}