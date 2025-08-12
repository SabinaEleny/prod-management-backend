import { ProductRepository } from '../repositories/product.repository';
import { ProductModel } from '../models/product.model';
import { createMockProduct } from '../_mocks_/product.mocks';
import { ProductCategory, SortDirection } from '../utils/enums';

describe('ProductRepository', () => {
    let productRepository: ProductRepository;

    beforeEach(() => {
        productRepository = new ProductRepository();
    });

    describe('create', () => {
        it('should create a new product and save it to the database', async () => {
            const mockProductData = createMockProduct({ name: 'Test Laptop' });
            const createdProduct = await productRepository.create(mockProductData);

            expect(createdProduct).toBeDefined();
            expect(createdProduct._id).toBeDefined();
            expect(createdProduct.name).toEqual(mockProductData.name);

            const foundProduct = await ProductModel.findById(createdProduct._id);
            expect(foundProduct).not.toBeNull();
            expect(foundProduct?.price).toEqual(mockProductData.price);
        });
    });

    describe('getAll', () => {
        beforeEach(async () => {
            const mockProducts = [
                createMockProduct({ name: 'Laptop', category: ProductCategory.Electronics, price: 1500 }),
                createMockProduct({ name: 'T-Shirt', category: ProductCategory.Apparel, price: 25 }),
                createMockProduct({ name: 'Monitor', category: ProductCategory.Electronics, price: 500 }),
                createMockProduct({ name: 'Mouse', category: ProductCategory.Electronics, price: 50 }),
                createMockProduct({ name: 'Jeans', category: ProductCategory.Apparel, price: 75 }),
            ];
            await ProductModel.insertMany(mockProducts);
        });

        it('should return all products when no filters are applied', async () => {
            const { products, total } = await productRepository.getAll({
                page: 1,
                limit: 10,
                filter: {},
                sort: {},
            });

            expect(products.length).toBe(5);
            expect(total).toBe(5);
        });

        it('should filter products by category', async () => {
            const { products, total } = await productRepository.getAll({
                page: 1,
                limit: 10,
                filter: { category: 'Apparel' },
                sort: {},
            });

            expect(products.length).toBe(2);
            expect(total).toBe(2);
            expect(products.every((p) => p.category === ProductCategory.Apparel)).toBe(true);
        });

        it('should sort products by price in ascending order', async () => {
            const { products } = await productRepository.getAll({
                page: 1,
                limit: 10,
                filter: {},
                sort: { price: SortDirection.Ascending },
            });

            expect(products[0].price).toBe(25);
            expect(products[1].price).toBe(50);
            expect(products[4].price).toBe(1500);
        });

        it('should paginate results correctly', async () => {
            const { products, total } = await productRepository.getAll({
                page: 2,
                limit: 2,
                filter: { category: 'Electronics' },
                sort: { price: SortDirection.Descending },
            });

            expect(products.length).toBe(1);
            expect(total).toBe(3);
            expect(products[0].name).toBe('Mouse');
        });
    });

    describe('getById', () => {
        it('should return a single product if a valid ID is provided', async () => {
            const mockProduct = createMockProduct();
            const createdProduct = await ProductModel.create(mockProduct);
            const foundProduct = await productRepository.getById(createdProduct._id.toHexString());

            expect(foundProduct).not.toBeNull();
            expect(foundProduct?.name).toEqual(mockProduct.name);
        });

        it('should return null if an invalid ID is provided', async () => {
            const nonExistentId = '605c723a1a3e5b3b8c8d5c8a';
            const foundProduct = await productRepository.getById(nonExistentId);
            expect(foundProduct).toBeNull();
        });
    });

    describe('update', () => {
        it('should find a product by ID and update it', async () => {
            const mockProduct = createMockProduct({ name: 'Old Name' });
            const createdProduct = await ProductModel.create(mockProduct);
            const updateData = { price: 1250, stock: 8 };

            const updatedProduct = await productRepository.update(createdProduct._id.toHexString(), updateData);

            expect(updatedProduct).not.toBeNull();
            expect(updatedProduct?.price).toEqual(1250);
            expect(updatedProduct?.stock).toEqual(8);
            expect(updatedProduct?.name).toEqual(mockProduct.name);
        });
    });

    describe('delete', () => {
        it('should find a product by ID and delete it', async () => {
            const mockProduct = createMockProduct({ name: 'ToDelete' });
            const createdProduct = await ProductModel.create(mockProduct);
            const productId = createdProduct._id.toHexString();

            const deletedProduct = await productRepository.delete(productId);

            expect(deletedProduct).not.toBeNull();
            expect(deletedProduct?.name).toEqual(mockProduct.name);

            const foundProductAfterDelete = await ProductModel.findById(productId);
            expect(foundProductAfterDelete).toBeNull();
        });
    });
});
