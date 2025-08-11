import { BaseRouter } from './base.router';
import { ProductService } from '../services/product.service';
import { ProductDocument } from '../models/product.model';
import { validate } from '../middlewares/validation.handler';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { protect } from '../middlewares/auth.handler';
import {Router} from "express";

export class ProductRouter extends BaseRouter<ProductDocument, ProductService> {
    constructor(router: Router) {
        super(router, new ProductService(), 'Product');
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.get('/products', this.getAll.bind(this));
        this.router.get('/products/:id', this.getById.bind(this));

        this.router.post('/products',
            protect(['admin']),
            validate(createProductSchema),
            this.create.bind(this)
        );

        this.router.put('/products/:id',
            protect(['admin']),
            validate(updateProductSchema),
            this.update.bind(this)
        );

        this.router.delete('/products/:id',
            protect(['admin']),
            this.delete.bind(this)
        );
    }
}