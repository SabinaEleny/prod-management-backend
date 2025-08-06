import { Schema, model, Document, Types } from 'mongoose';

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type UserDocument = User & Document & {
    _id: Types.ObjectId;
};

const UserSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const UserModel = model<UserDocument>('User', UserSchema);