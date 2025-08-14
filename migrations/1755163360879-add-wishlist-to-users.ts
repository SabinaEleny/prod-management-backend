import { Db } from 'mongodb';

export const up = async (db: Db) => {
    await db.collection('users').updateMany({ wishlist: { $exists: false } }, { $set: { wishlist: [] } });
};

export const down = async (db: Db) => {
    await db.collection('users').updateMany({ wishlist: { $exists: true } }, { $unset: { wishlist: '' } });
};
