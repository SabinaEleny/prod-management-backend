import { Product } from '../models/product.model';
import { ProductCategory } from '../utils/enums';

export const createMockProduct = (overrides: Partial<Product> = {}): Product => {
    return {
        name: 'Generic Laptop',
        category: ProductCategory.Electronics,
        price: 1200,
        stock: 50,
        ...overrides,
    };
};
