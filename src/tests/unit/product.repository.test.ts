import { ProductRepository } from '../../repositories/product.repository';
import { ProductModel } from '../../models/product.model';
import { createMockProduct } from '../../_mocks_/product.mocks';
import { ProductCategory, SortDirection } from '../../utils/enums';

jest.mock('../../models/product.model');

describe('ProductRepository', () => {
    let productRepository: ProductRepository;
    const mockedProductModel = ProductModel as jest.Mocked<typeof ProductModel>;

    beforeEach(() => {
        jest.clearAllMocks();
        productRepository = new ProductRepository();
    });

    describe('create', () => {
        it('should call ProductModel.create with correct data and return the result', async () => {
            const mockProductData = createMockProduct({ name: 'Test Laptop' });
            const mockCreatedProduct = { ...mockProductData, _id: 'a-unique-id' };

            mockedProductModel.create.mockResolvedValue(mockCreatedProduct as any);

            const result = await productRepository.create(mockProductData);
            expect(mockedProductModel.create).toHaveBeenCalledWith(mockProductData);

            expect(result).toEqual(mockCreatedProduct);
        });
    });

    describe('getAll', () => {
        const findQueryMock = {
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
        };

        beforeEach(() => {
            mockedProductModel.find.mockReturnValue(findQueryMock as any);
        });

        it('should return all products when no filters are applied', async () => {
            const mockProducts = [createMockProduct(), createMockProduct()];
            findQueryMock.limit.mockResolvedValue(mockProducts);
            mockedProductModel.countDocuments.mockResolvedValue(2);

            const { products, total } = await productRepository.getAll({
                page: 1,
                limit: 10,
                filter: {},
                sort: {},
            });

            expect(mockedProductModel.find).toHaveBeenCalledWith({});
            expect(mockedProductModel.countDocuments).toHaveBeenCalledWith({});
            expect(products.length).toBe(2);
            expect(total).toBe(2);
        });

        it('should filter products by category', async () => {
            const apparelProducts = [createMockProduct({ category: ProductCategory.Apparel })];
            findQueryMock.limit.mockResolvedValue(apparelProducts);
            mockedProductModel.countDocuments.mockResolvedValue(1);

            const expectedFilter = { category: { $regex: 'Apparel', $options: 'i' } };

            const { products, total } = await productRepository.getAll({
                page: 1,
                limit: 10,
                filter: { category: 'Apparel' },
                sort: {},
            });

            expect(mockedProductModel.find).toHaveBeenCalledWith(expectedFilter);
            expect(mockedProductModel.countDocuments).toHaveBeenCalledWith(expectedFilter);
            expect(products.length).toBe(1);
            expect(total).toBe(1);
        });

        it('should sort products by price in ascending order', async () => {
            const sortedProducts = [createMockProduct({ price: 25 }), createMockProduct({ price: 50 })];
            findQueryMock.limit.mockResolvedValue(sortedProducts);
            mockedProductModel.countDocuments.mockResolvedValue(2);

            await productRepository.getAll({
                page: 1,
                limit: 10,
                filter: {},
                sort: { price: SortDirection.Ascending },
            });

            expect(findQueryMock.sort).toHaveBeenCalledWith({ price: 1 });
        });

        it('should paginate results correctly', async () => {
            const electronicsProducts = [createMockProduct({ name: 'Mouse' })];
            findQueryMock.limit.mockResolvedValue(electronicsProducts);
            mockedProductModel.countDocuments.mockResolvedValue(3);

            const { products, total } = await productRepository.getAll({
                page: 2,
                limit: 2,
                filter: { category: 'Electronics' },
                sort: {},
            });

            expect(findQueryMock.skip).toHaveBeenCalledWith(2);
            expect(findQueryMock.limit).toHaveBeenCalledWith(2);
            expect(products.length).toBe(1);
            expect(total).toBe(3);
        });
    });

    describe('getById', () => {
        it('should return a single product if a valid ID is provided', async () => {
            const productId = 'valid-id-123';
            const mockProduct = { ...createMockProduct(), _id: productId };
            mockedProductModel.findById.mockResolvedValue(mockProduct as any);

            const foundProduct = await productRepository.getById(productId);

            expect(mockedProductModel.findById).toHaveBeenCalledWith(productId);
            expect(foundProduct).toEqual(mockProduct);
        });

        it('should return null if an invalid ID is provided', async () => {
            const nonExistentId = 'invalid-id-456';
            mockedProductModel.findById.mockResolvedValue(null);

            const foundProduct = await productRepository.getById(nonExistentId);

            expect(mockedProductModel.findById).toHaveBeenCalledWith(nonExistentId);
            expect(foundProduct).toBeNull();
        });
    });

    describe('update', () => {
        it('should find a product by ID and update it', async () => {
            const productId = 'product-to-update-id';
            const updateData = { price: 1250, stock: 8 };
            const mockUpdatedProduct = { ...createMockProduct(), _id: productId, ...updateData };

            mockedProductModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedProduct as any);

            const updatedProduct = await productRepository.update(productId, updateData);

            expect(mockedProductModel.findByIdAndUpdate).toHaveBeenCalledWith(productId, updateData, { new: true });
            expect(updatedProduct).toEqual(mockUpdatedProduct);
        });
    });

    describe('delete', () => {
        it('should find a product by ID and delete it', async () => {
            const productId = 'product-to-delete-id';
            const mockDeletedProduct = { ...createMockProduct(), _id: productId };

            mockedProductModel.findByIdAndDelete.mockResolvedValue(mockDeletedProduct as any);

            const deletedProduct = await productRepository.delete(productId);

            expect(mockedProductModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
            expect(deletedProduct).toEqual(mockDeletedProduct);
        });
    });
});
