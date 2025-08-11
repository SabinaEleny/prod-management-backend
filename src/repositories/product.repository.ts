import { UpdateQuery } from 'mongoose';
import { ProductModel, ProductDocument, Product } from '../models/product.model';
import { SortDirection } from '../utils/enums';

export type IProductQueryOptions = {
    page: number;
    limit: number;
    filter: { category?: string };
    sort: { price?: SortDirection };
}

export class ProductRepository {
    public async getAll(options: IProductQueryOptions): Promise<{ products: ProductDocument[]; total: number }> {
        const { page, limit, filter, sort } = options;

        const query: any = {};
        if (filter.category) {
            query.category = { $regex: filter.category, $options: 'i' };
        }

        const sortOptions: any = {};
        if (sort.price) {
            sortOptions.price = sort.price === 'asc' ? 1 : -1;
        }

        const skip = (page - 1) * limit;

        const products = await ProductModel.find(query).sort(sortOptions).skip(skip).limit(limit);
        const total = await ProductModel.countDocuments(query);

        return { products, total };
    }

    public async getById(id: string): Promise<ProductDocument | null> {
        return ProductModel.findById(id);
    }

    public async create(productData: Product): Promise<ProductDocument> {
        return ProductModel.create(productData);
    }

    public async update(id: string, productData: UpdateQuery<ProductDocument>): Promise<ProductDocument | null> {
        return ProductModel.findByIdAndUpdate(id, productData, { new: true });
    }

    public async delete(id: string): Promise<ProductDocument | null> {
        return ProductModel.findByIdAndDelete(id);
    }
}