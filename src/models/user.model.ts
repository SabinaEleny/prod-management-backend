import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { OrderModel } from './order.model';
import { UserRole } from '../utils/enums';

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    isBanned: boolean;
};

export type UserDocument = User &
    Document<Types.ObjectId> & {
        comparePassword(candidatePassword: string): Promise<boolean>;
    };

const UserSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.Customer,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
});

UserSchema.pre('findOneAndDelete', async function (next) {
    try {
        const userToDelete = this.getQuery();
        if (userToDelete._id) {
            await OrderModel.deleteMany({ user: userToDelete._id });
        }
        next();
    } catch (error: any) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password as string);
};

export const UserModel = model<UserDocument>('User', UserSchema);
