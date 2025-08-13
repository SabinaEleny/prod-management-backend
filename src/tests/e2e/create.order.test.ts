import supertest from 'supertest';
import { App } from '../../app';
import { UserModel } from '../../models/user.model';
import { ProductModel } from '../../models/product.model';
import { createMockUser } from '../../_mocks_/user.mocks';
import { createMockProduct } from '../../_mocks_/product.mocks';

const request = supertest(new App().app);

describe('Order E2E Tests', () => {
    it('(GET) / should allow a logged-in, non-banned user to create an order', async () => {
        const customerData = createMockUser({ email: 'e2e-customer@example.com' });
        await UserModel.create(customerData);

        const product1 = await ProductModel.create(createMockProduct({ name: 'E2E Laptop', stock: 10, price: 1000 }));
        const product2 = await ProductModel.create(createMockProduct({ name: 'E2E Mouse', stock: 20, price: 50 }));

        const loginRes = await request.post('/api/auth/login').send({
            email: customerData.email,
            password: customerData.password,
        });

        const cookiesArray = loginRes.get('Set-Cookie');

        expect(cookiesArray).toBeDefined();
        const cookie = Array.isArray(cookiesArray) ? cookiesArray.join('; ') : '';

        const orderPayload = {
            products: [
                { id: product1._id.toHexString(), quantity: 1 },
                { id: product2._id.toHexString(), quantity: 2 },
            ],
        };

        const createOrderRes = await request.post('/api/orders').set('Cookie', cookie).send(orderPayload);

        expect(createOrderRes.status).toBe(201);
        expect(createOrderRes.body).toBeDefined();
        expect(createOrderRes.body.user.email).toEqual(customerData.email);
        expect(createOrderRes.body.productsPurchased.length).toBe(2);
        expect(createOrderRes.body.totalAmount).toBe(1100); // 1000 * 1 + 50 * 2

        const updatedProduct1 = await ProductModel.findById(product1._id);
        const updatedProduct2 = await ProductModel.findById(product2._id);

        expect(updatedProduct1?.stock).toBe(9);
        expect(updatedProduct2?.stock).toBe(18);
    });

    it('should forbid a banned user from creating an order', async () => {
        const bannedUserData = createMockUser({ email: 'e2e-banned@example.com', isBanned: true });
        await UserModel.create(bannedUserData);
        const product = await ProductModel.create(createMockProduct({ stock: 10 }));

        const loginRes = await request.post('/api/auth/login').send({
            email: bannedUserData.email,
            password: bannedUserData.password,
        });
        const cookiesArray = loginRes.get('Set-Cookie');

        expect(cookiesArray).toBeDefined();
        const cookie = Array.isArray(cookiesArray) ? cookiesArray.join('; ') : '';

        const orderPayload = {
            products: [{ id: product._id.toHexString(), quantity: 1 }],
        };

        const createOrderRes = await request.post('/api/orders').set('Cookie', cookie).send(orderPayload);

        expect(createOrderRes.status).toBe(403);
        expect(createOrderRes.body.message).toContain('Banned users cannot place orders');

        const finalProduct = await ProductModel.findById(product._id);
        expect(finalProduct?.stock).toBe(10);
    });
});
