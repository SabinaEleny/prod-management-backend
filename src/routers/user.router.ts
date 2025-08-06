import { BaseRouter } from './base.router';
import { UserService } from '../services/user.service';
import { UserDocument } from '../models/user.model';
import { validate } from '../middlewares/validation.handler';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';

export class UserRouter extends BaseRouter<UserDocument, UserService> {
    constructor() {
        super(new UserService(), 'User');
    }

    protected initializeRoutes(): void {
        super.initializeRoutes();
        this.router.post(`/`, validate(createUserSchema), this.create.bind(this));
        this.router.put(`/:id`, validate(updateUserSchema), this.update.bind(this));
    }
}