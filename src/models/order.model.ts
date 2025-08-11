import { Schema, model, Document, Types } from 'mongoose';

export type Order = {
    user: Types.ObjectId;
    productsPurchased: {
        product: Types.ObjectId;
        quantity: number;
    }[];
    totalAmount: number;
};

export type OrderDocument = Order & Document<Types.ObjectId>;

const OrderSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        productsPurchased: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, min: 1 }
            }
        ],
        totalAmount: { type: Number, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export const OrderModel = model<OrderDocument>('Order', OrderSchema);