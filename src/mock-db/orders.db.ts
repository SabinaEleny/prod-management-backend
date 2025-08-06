import {Order} from "../models/order.model";
import {users} from "../models/user.model";

export const ordersDb: Order[] = [
    {
        id: 1,
        user: users[0],
        productsPurchased: [
            { id: 1, quantity: 1 },
            { id: 4, quantity: 2 }
        ],
        totalAmount: 1299.98
    },
    {
        id: 2,
        user: users[1],
        productsPurchased: [
            { id: 2, quantity: 5 }
        ],
        totalAmount: 125.00
    }
];