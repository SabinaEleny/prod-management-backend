import { BaseRouter } from './base.router';
import { ProductService } from '../services/product.service';
import { ProductDocument } from '../models/product.model';
import { validate } from '../middlewares/validation.handler';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

export class ProductRouter extends BaseRouter<ProductDocument, ProductService> {
    constructor() {
        super(new ProductService(), 'Product');
    }

    protected initializeRoutes(): void {
        super.initializeRoutes();
        this.router.post(`/`, validate(createProductSchema), this.create.bind(this));
        this.router.put(`/:id`, validate(updateProductSchema), this.update.bind(this));
    }
}