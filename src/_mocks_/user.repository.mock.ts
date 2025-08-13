export const UserRepositoryMock = jest.fn().mockImplementation(() => {
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        getByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
});
