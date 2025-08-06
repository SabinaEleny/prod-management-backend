import { Router, Request, Response } from 'express';
import { BaseServiceType } from '../services/base.service';

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
        this.router.get(`/`, this.getAll.bind(this));
        this.router.get(`/:id`, this.getById.bind(this));
        this.router.post(`/`, this.create.bind(this));
        this.router.put(`/:id`, this.update.bind(this));
        this.router.delete(`/:id`, this.delete.bind(this));
    }

    public async create(req: Request, res: Response): Promise<Response | void> {
        try {
            const result = await this.service.create(req.body);
            if (result && typeof result === 'object' && 'error' in result) {
                return res.status(400).json({ message: result.error });
            }
            return res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async getAll(req: Request, res: Response): Promise<Response | void> {
        try {
            const items = await this.service.getAll(req.query);
            return res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async getById(req: Request, res: Response): Promise<Response | void> {
        try {
            const item = await this.service.getById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: `${this.entityName} not found` });
            }
            return res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async update(req: Request, res: Response): Promise<Response | void> {
        try {
            const item = await this.service.update(req.params.id, req.body);
            if (!item) {
                return res.status(404).json({ message: `${this.entityName} not found` });
            }
            return res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public async delete(req: Request, res: Response): Promise<Response | void> {
        try {
            const item = await this.service.delete(req.params.id);
            if (!item) {
                return res.status(404).json({ message: `${this.entityName} not found` });
            }
            return res.status(200).json({ message: `${this.entityName} deleted successfully` });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}