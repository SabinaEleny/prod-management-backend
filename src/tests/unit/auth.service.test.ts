import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';
import { createMockUser } from '../../_mocks_/user.mocks';
import { UserRole } from '../../utils/enums';

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    describe('Login', () => {
        it('should allow a valid user to log in and return a token', async () => {
            const mockUser = createMockUser();
            await UserModel.create(mockUser);

            const result = await authService.login(mockUser.email, mockUser.password);

            expect(result).toBeDefined();
            expect('token' in result).toBe(true);
            if ('token' in result) {
                expect(result.token).toBeDefined();
                expect(result.user.email).toEqual(mockUser.email);
            }
        });

        it('should reject login with an incorrect password', async () => {
            const mockUser = createMockUser({
                email: 'test2@example.com',
                password: 'correctpassword',
            });
            await UserModel.create(mockUser);

            const result = await authService.login(mockUser.email, 'wrongpassword');

            expect('error' in result).toBe(true);
            if ('error' in result) {
                expect(result.error).toEqual('Invalid credentials.');
            }
        });

        it('should reject login for a user that does not exist', async () => {
            const result = await authService.login('ghost@example.com', 'anypassword');

            expect('error' in result).toBe(true);
            if ('error' in result) {
                expect(result.error).toEqual('Invalid credentials.');
            }
        });
    });

    describe('Signup', () => {
        it('should successfully create a new user and return user data without the password', async () => {
            const mockNewUser = createMockUser({ email: 'newuser@example.com' });
            const result = await authService.signup(mockNewUser);

            expect('error' in result).toBe(false);
            if ('email' in result) {
                expect(result.email).toEqual(mockNewUser.email);
                expect(result).not.toHaveProperty('password');
            }

            const savedUser = await UserModel.findOne({ email: 'newuser@example.com' });
            expect(savedUser).toBeDefined();
            expect(savedUser?.password).not.toEqual(mockNewUser.password);
        });

        it('should return an error if the email is already in use', async () => {
            const existingUser = createMockUser({ email: 'existing@example.com' });
            await UserModel.create(existingUser);

            const newUserWithSameEmail = createMockUser({ email: 'existing@example.com' });
            const result = await authService.signup(newUserWithSameEmail);

            expect('error' in result).toBe(true);
            if ('error' in result) {
                expect(result.error).toEqual('Email is already in use.');
            }
        });

        it('should hash the password before saving the user to the database', async () => {
            const mockNewUser = createMockUser({ password: 'plain-text-password' });
            await authService.signup(mockNewUser);

            const savedUser = await UserModel.findOne({ email: mockNewUser.email }).select('+password');
            expect(savedUser).toBeDefined();
            const isMatch = await savedUser?.comparePassword('plain-text-password');
            expect(isMatch).toBe(true);
        });
    });
});
