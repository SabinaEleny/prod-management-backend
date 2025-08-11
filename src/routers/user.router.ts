import { BaseRouter } from './base.router';
import { UserService } from '../services/user.service';
import { UserDocument } from '../models/user.model';
import { validate } from '../middlewares/validation.handler';
import { adminCreateUserSchema, adminUpdateUserSchema } from '../schemas/user.schema';
import { AuthRequest, protect } from '../middlewares/auth.handler';
import {Response, Router} from 'express';

export class UserRouter extends BaseRouter<UserDocument, UserService> {
    constructor(router: Router) {
        super(router,new UserService(), 'User');
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.get('/users/profile', protect(), this.getProfile.bind(this));
        this.router.put('/users/:id/ban', protect(['admin']), this.banUser.bind(this));

        this.router.get('/users', protect(['admin']), this.getAll.bind(this));
        this.router.get('/users/:id', protect(['admin']), this.getById.bind(this));
        this.router.post('/users', protect(['admin']), validate(adminCreateUserSchema), this.create.bind(this));
        this.router.put('/users/:id', protect(['admin']), validate(adminUpdateUserSchema), this.update.bind(this));
        this.router.delete('/users/:id', protect(['admin']), this.delete.bind(this));
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