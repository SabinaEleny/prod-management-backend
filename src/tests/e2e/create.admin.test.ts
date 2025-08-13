import supertest from 'supertest';
import { App } from '../../app';
import { UserModel } from '../../models/user.model';
import { createMockUser, createMockAdmin } from '../../_mocks_/user.mocks';
import { UserRole } from '../../utils/enums';

const request = supertest(new App().app);

describe('User Management E2E Tests', () => {
    let adminCookie: string[] | undefined;

    beforeAll(async () => {
        const adminData = createMockAdmin();
        await UserModel.create(adminData);

        const loginRes = await request.post('/api/auth/login').send({
            email: adminData.email,
            password: adminData.password,
        });

        adminCookie = loginRes.get('Set-Cookie');
    });

    it('should allow an admin to update a customer to become an admin', async () => {
        const customerData = createMockUser({ email: 'customer-to-promote@example.com' });
        const customer = await UserModel.create(customerData);
        const customerId = customer._id.toHexString();

        const updatePayload = {
            role: UserRole.Admin,
            firstName: 'Promoted',
            lastName: 'User',
        };

        expect(adminCookie).toBeDefined();
        const aCookie = Array.isArray(adminCookie) ? adminCookie.join(',') : '';

        const updateUserRes = await request.put(`/api/users/${customerId}`).set('Cookie', aCookie).send(updatePayload);

        expect(updateUserRes.status).toBe(200);
        expect(updateUserRes.body.role).toEqual(UserRole.Admin);
        expect(updateUserRes.body.firstName).toEqual('Promoted');

        const updatedUserInDb = await UserModel.findById(customerId);
        expect(updatedUserInDb).toBeDefined();
        expect(updatedUserInDb?.role).toEqual(UserRole.Admin);
    });

    it('should NOT allow a regular customer to update another user', async () => {
        const customer1Data = createMockUser({ email: 'customer1@example.com' });
        const customer2Data = createMockUser({ email: 'customer2@example.com' });
        await UserModel.create(customer1Data);
        const customer2 = await UserModel.create(customer2Data);
        const customer2Id = customer2._id.toHexString();

        const loginRes = await request.post('/api/auth/login').send({
            email: customer1Data.email,
            password: customer1Data.password,
        });

        const cookie = loginRes.get('Set-Cookie');
        const customerCookie = Array.isArray(cookie) ? cookie.join(',') : '';
        const updatePayload = { firstName: 'Hacked' };

        const updateUserRes = await request
            .put(`/api/users/${customer2Id}`)
            .set('Cookie', customerCookie)
            .send(updatePayload);

        expect(updateUserRes.status).toBe(403);
        expect(updateUserRes.body.message).toContain('You do not have the required role.');
    });
});
