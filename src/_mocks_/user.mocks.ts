import { User } from '../models/user.model';
import { UserRole } from '../utils/enums';

export const createMockUser = (overrides: Partial<User> = {}): User => {
    return {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: UserRole.Customer,
        isBanned: false,
        ...overrides,
    };
};

export const createMockAdmin = (overrides: Partial<User> = {}): User => {
    return {
        ...createMockUser({ email: 'admin@example.com', role: UserRole.Admin }),
        ...overrides,
    };
};
