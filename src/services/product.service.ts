import { Product, ProductDocument } from '../models/product.model';
import { ProductRepository, IProductQueryOptions } from '../repositories/product.repository';
import { UpdateQuery } from 'mongoose';
import { SortDirection } from '../utils/enums';


export type IGetAllProductsQuery = {
    page?: string;
    limit?: string;
    category?: string;
    sortByPrice?: SortDirection;
}

export class ProductService {
    private readonly productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    public async getAll(
        queryParams: IGetAllProductsQuery
    ): Promise<{ products: ProductDocument[]; total: number; page: number; totalPages: number }> {
        const options: IProductQueryOptions = {
            page: queryParams.page ? parseInt(queryParams.page, 10) : 1,
            limit: queryParams.limit ? parseInt(queryParams.limit, 10) : 10,
            filter: {
                category: queryParams.category,
            },
            sort: {
                price: queryParams.sortByPrice,
            },
        };

        const { products, total } = await this.productRepository.getAll(options);
        const totalPages = Math.ceil(total / options.limit);

        return { products, total, page: options.page, totalPages };
    }

    public async getById(id: string): Promise<ProductDocument | undefined> {
        const product = await this.productRepository.getById(id);
        return product ?? undefined;
    }

    public async create(productData: Product): Promise<ProductDocument> {
        return this.productRepository.create(productData);
    }

    public async update(id: string, productData: UpdateQuery<ProductDocument>): Promise<ProductDocument | undefined> {
        const product = await this.productRepository.update(id, productData);
        return product ?? undefined;
    }

    public async delete(id: string): Promise<ProductDocument | undefined> {
        const product = await this.productRepository.delete(id);
        return product ?? undefined;
    }
}