import { Db } from 'mongodb';

export const up = async (db: Db) => {
    const productsToUpdate = await db
        .collection('products')
        .find({
            price: { $type: 'number' },
        })
        .toArray();

    for (const product of productsToUpdate) {
        const newPrice = {
            amount: product.price,
            currency: 'EUR',
        };
        await db.collection('products').updateOne({ _id: product._id }, { $set: { price: newPrice } });
    }
};

export const down = async (db: Db) => {
    const productsToRevert = await db
        .collection('products')
        .find({
            price: { $type: 'object' },
        })
        .toArray();

    for (const product of productsToRevert) {
        if (product.price && typeof product.price.amount === 'number') {
            const oldPrice = product.price.amount;
            await db.collection('products').updateOne({ _id: product._id }, { $set: { price: oldPrice } });
        }
    }
};
