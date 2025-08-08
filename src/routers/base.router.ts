import { Router, Response } from 'express';
import { BaseServiceType } from '../services/base.service';
import { asyncHandler } from '../middlewares/async.handler';
import { AuthRequest } from '../middlewares/auth.handler';

export class BaseRouter<T, TService extends BaseServiceType<T>> {
    public router: Router;
    protected service: TService;
    protected entityName: string;

    constructor(service: TService, entityName: string) {
        this.service = service;
        this.entityName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
        this.router = Router();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.get(`/`, asyncHandler(this.getAll.bind(this)));
        this.router.get(`/:id`, asyncHandler(this.getById.bind(this)));
        this.router.post(`/`, asyncHandler(this.create.bind(this)));
        this.router.put(`/:id`, asyncHandler(this.update.bind(this)));
        this.router.delete(`/:id`, asyncHandler(this.delete.bind(this)));
    }

    public async getAll(req: AuthRequest, res: Response): Promise<Response> {
        const user = req.user;
        let items;

        if (this.entityName === 'Order' && user && user.role === 'customer') {
            items = await this.service.getAll(user);
        } else {
            items = await this.service.getAll(req.query);
        }

        return res.status(200).json(items);
    }

    public async getById(req: AuthRequest, res: Response): Promise<Response> {
        const item = await this.service.getById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: `${this.entityName} not found` });
        }
        return res.status(200).json(item);
    }


    public async create(req: AuthRequest, res: Response): Promise<Response> {
        let result;

        if (this.entityName === 'Order') {
            result = await this.service.create(req.body, req.user!);
        } else {
            result = await this.service.create(req.body);
        }

        if (result && typeof result === 'object' && 'error' in result) {
            const statusCode = result.error.startsWith('Forbidden') ? 403 : 400;
            return res.status(statusCode).json({ message: result.error });
        }

        return res.status(201).json(result);
    }

    public async update(req: AuthRequest, res: Response): Promise<Response> {
        const item = await this.service.update(req.params.id, req.body);
        if (!item) {
            return res.status(404).json({ message: `${this.entityName} not found` });
        }
        return res.status(200).json(item);
    }

    public async delete(req: AuthRequest, res: Response): Promise<Response> {
        const item = await this.service.delete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: `${this.entityName} not found` });
        }
        return res.status(200).json({ message: `${this.entityName} deleted successfully` });
    }
}