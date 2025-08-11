import { Router, Request, Response } from 'express';
import { BaseServiceType } from '../services/base.service';
import { AuthRequest } from '../middlewares/auth.handler';

export class BaseRouter<T, TService extends BaseServiceType<T>> {
    public router: Router;
    protected service: TService;
    protected entityName: string;

    constructor(router: Router, service: TService, entityName: string) {
        this.router = router;
        this.service = service;
        this.entityName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
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