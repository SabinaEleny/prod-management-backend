import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validate } from '../middlewares/validation.handler';
import { signupSchema, loginSchema } from '../schemas/user.schema';

export class AuthRouter {
    public router: Router;
    private authService: AuthService;

    constructor() {
        this.router = Router();
        this.authService = new AuthService();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/signup', validate(signupSchema), this.signup.bind(this));
        this.router.post('/login', validate(loginSchema), this.login.bind(this));
        this.router.post('/logout', this.logout.bind(this));
    }

    public async signup(req: Request, res: Response) {
        const result = await this.authService.signup(req.body);
        if ('error' in result) {
            return res.status(400).json({ message: result.error });
        }
        res.status(201).json(result);
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await this.authService.login(email, password);

        if ('error' in result) {
            return res.status(401).json({ message: result.error });
        }

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ user: result.user });
    }

    public logout(req: Request, res: Response) {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
}