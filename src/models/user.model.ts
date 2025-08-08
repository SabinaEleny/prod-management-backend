import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'customer' | 'admin';
    isBanned: boolean;
};

export type UserDocument = User & Document & {
    _id: Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
};

const UserSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer'
        },
        isBanned: {
            type: Boolean,
            default: false
        }
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

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<UserDocument>('User', UserSchema);