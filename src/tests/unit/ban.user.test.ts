import { UserRouter } from '../../routers/user.router';
import { UserService } from '../../services/user.service';
import { jest } from '@jest/globals';
import { Router } from 'express';
import { AuthRequest } from '../../middlewares/auth';

describe('UserRouter', () => {
    let userRouter: UserRouter;

    beforeEach(() => {
        jest.restoreAllMocks();
        userRouter = new UserRouter(Router());
    });

    describe('banUser', () => {
        it('it should ban the user and return response 200', async () => {
            const userId = 'user-id-123';
            const mockUserReturnat = { _id: userId, isBanned: true };

            const banUserSpy = jest.spyOn(UserService.prototype, 'banUser').mockResolvedValue(mockUserReturnat as any);

            const mockReq = {
                params: { id: userId },
            } as unknown as AuthRequest;

            const mockJson = jest.fn();
            const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
            const mockRes = {
                status: mockStatus,
            } as any;

            await userRouter.banUser(mockReq, mockRes);

            expect(banUserSpy).toHaveBeenCalledWith(userId);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'User has been banned successfully',
                user: mockUserReturnat,
            });
        });

        it('it should return 404 if user is not found', async () => {
            const userId = 'user-id-not-found';

            const banUserSpy = jest.spyOn(UserService.prototype, 'banUser').mockResolvedValue(undefined);

            const mockReq = {
                params: { id: userId },
            } as unknown as AuthRequest;

            const mockJson = jest.fn();
            const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
            const mockRes = {
                status: mockStatus,
            } as any;

            await userRouter.banUser(mockReq, mockRes);

            expect(banUserSpy).toHaveBeenCalledWith(userId);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });
});
