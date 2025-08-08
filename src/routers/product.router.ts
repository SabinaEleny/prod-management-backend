import { BaseRouter } from './base.router';
import { ProductService } from '../services/product.service';
import { ProductDocument } from '../models/product.model';
import { validate } from '../middlewares/validation.handler';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { isAuthenticated, isAdmin } from '../middlewares/auth.handler';
import { asyncHandler } from '../middlewares/async.handler';

export class ProductRouter extends BaseRouter<ProductDocument, ProductService> {
    constructor() {
        super(new ProductService(), 'Product');
    }

    protected initializeRoutes(): void {
        this.router.get(`/`, asyncHandler(this.getAll.bind(this)));
        this.router.get(`/:id`, asyncHandler(this.getById.bind(this)));

        this.router.post(`/`,
            isAuthenticated,
            isAdmin,
            validate(createProductSchema),
            asyncHandler(this.create.bind(this))
        );

        this.router.put(`/:id`,
            isAuthenticated,
            isAdmin,
            validate(updateProductSchema),
            asyncHandler(this.update.bind(this))
        );

        this.router.delete(`/:id`,
            isAuthenticated,
            isAdmin,
            asyncHandler(this.delete.bind(this))
        );
    }
}