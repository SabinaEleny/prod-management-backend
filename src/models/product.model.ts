import { Schema, model, Document, Types } from 'mongoose';

export type Product = {
    name: string;
    category: string;
    price: number;
    stock: number;
};

export type ProductDocument = Product & Document & {
    _id: Types.ObjectId;
};

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0, default: 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const ProductModel = model<ProductDocument>('Product', ProductSchema);