import { BaseRouter } from './base.router';
import { UserService } from '../services/user.service';
import { UserDocument } from '../models/user.model';
import { validate } from '../middlewares/validation.handler';
import { adminCreateUserSchema, adminUpdateUserSchema } from '../schemas/user.schema';
import { AuthRequest, isAuthenticated, isAdmin } from '../middlewares/auth.handler';
import { Response } from 'express';
import { asyncHandler } from '../middlewares/async.handler';

export class UserRouter extends BaseRouter<UserDocument, UserService> {
    constructor() {
        super(new UserService(), 'User');
    }

    protected initializeRoutes(): void {
        this.router.get('/profile', isAuthenticated, asyncHandler(this.getProfile.bind(this)));

        this.router.put('/:id/ban',
            isAuthenticated,
            isAdmin,
            asyncHandler(this.banUser.bind(this))
        );

        this.router.get(`/`, isAuthenticated, isAdmin, asyncHandler(this.getAll.bind(this)));
        this.router.get(`/:id`, isAuthenticated, isAdmin, asyncHandler(this.getById.bind(this)));
        this.router.post(`/`, isAuthenticated, isAdmin, validate(adminCreateUserSchema), asyncHandler(this.create.bind(this)));
        this.router.put(`/:id`, isAuthenticated, isAdmin, validate(adminUpdateUserSchema), asyncHandler(this.update.bind(this)));
        this.router.delete(`/:id`, isAuthenticated, isAdmin, asyncHandler(this.delete.bind(this)));
    }

    public async getProfile(req: AuthRequest, res: Response): Promise<Response> {
        return res.status(200).json(req.user);
    }

    public async banUser(req: AuthRequest, res: Response): Promise<Response> {
        const bannedUser = await this.service.banUser(req.params.id);
        if (!bannedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User has been banned successfully', user: bannedUser });
    }
}