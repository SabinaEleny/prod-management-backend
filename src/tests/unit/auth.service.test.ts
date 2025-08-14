import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import { createMockUser } from '../../_mocks_/user.mocks';
import jwt from 'jsonwebtoken';

jest.mock('../../models/user.model');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;
    const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;
    const mockedJwt = jwt as jest.Mocked<typeof jwt>;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService();
    });

    describe('Login', () => {
        it('should allow a valid user to log in and return a token', async () => {
            const mockPassword = 'correct-password';
            const userPayload = createMockUser();
            delete (userPayload as any).password;

            const mockUser = {
                ...createMockUser(),
                _id: 'user-id-123',
                password: 'hashed-password',
                comparePassword: jest.fn().mockResolvedValue(true),
                toObject: jest.fn().mockReturnValue(userPayload),
            };

            mockedUserModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            } as any);

            (mockedJwt.sign as jest.Mock).mockReturnValue('mock-jwt-token');

            const result = await authService.login(mockUser.email, mockPassword);

            expect(mockedUserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
            expect(mockUser.comparePassword).toHaveBeenCalledWith(mockPassword);
            expect('token' in result).toBe(true);
            if ('token' in result) {
                expect(result.token).toBe('mock-jwt-token');
                expect(result.user.email).toBe(mockUser.email);
            }
        });

        it('should reject login with an incorrect password', async () => {
            const mockUser = {
                ...createMockUser(),
                comparePassword: jest.fn().mockResolvedValue(false),
            };

            mockedUserModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser),
            } as any);

            const result = await authService.login(mockUser.email, 'wrong-password');

            expect(mockUser.comparePassword).toHaveBeenCalledWith('wrong-password');
            expect('error' in result).toBe(true);
            if ('error' in result) {
                expect(result.error).toEqual('Invalid credentials.');
            }
        });

        it('should reject login for a user that does not exist', async () => {
            mockedUserModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            } as any);

            const result = await authService.login('ghost@example.com', 'any-password');

            expect('error' in result).toBe(true);
            if ('error' in result) {
                expect(result.error).toEqual('Invalid credentials.');
            }
        });
    });

    describe('Signup', () => {
        it('should successfully create a new user and return user data without the password', async () => {
            const mockNewUser = createMockUser({ email: 'newuser@example.com' });
            const userWithoutPassword = { ...mockNewUser };
            delete (userWithoutPassword as any).password;

            const mockCreatedUser = {
                ...mockNewUser,
                toObject: jest.fn().mockReturnValue(userWithoutPassword),
            };

            mockedUserModel.findOne.mockResolvedValue(null);
            mockedUserModel.create.mockResolvedValue(mockCreatedUser as any);

            const result = await authService.signup(mockNewUser);

            expect(mockedUserModel.findOne).toHaveBeenCalledWith({ email: mockNewUser.email });
            expect(mockedUserModel.create).toHaveBeenCalledWith(mockNewUser);
            expect(result).toEqual(userWithoutPassword);
            expect(result).not.toHaveProperty('password');
        });

        it('should return an error if the email is already in use', async () => {
            const existingUser = createMockUser({ email: 'existing@example.com' });
            mockedUserModel.findOne.mockResolvedValue(existingUser as any);

            const result = await authService.signup(existingUser);

            expect(mockedUserModel.create).not.toHaveBeenCalled();
            expect('error' in result).toBe(true);
            if ('error' in result) {
                expect(result.error).toEqual('Email is already in use.');
            }
        });
    });
});
