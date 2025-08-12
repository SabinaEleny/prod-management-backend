import express, { Application, Router } from 'express';
import config from './config/config';
import { error, AppError } from './middlewares/error';
import { ProductRouter } from './routers/product.router';
import { UserRouter } from './routers/user.router';
import { OrderRouter } from './routers/order.router';
import { AuthRouter } from './routers/auth.router';
import cookieParser from 'cookie-parser';

export class App {
    private readonly app: Application;
    private readonly port: number;

    constructor() {
        this.app = express();
        this.port = config.port;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }

    private initializeMiddleware(): void {
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    private initializeRoutes(): void {
        const apiRouter = Router();
        const authRouter = new AuthRouter();

        new ProductRouter(apiRouter);
        new UserRouter(apiRouter);
        new OrderRouter(apiRouter);

        this.app.get('/favicon.ico', (req, res) => res.status(204).send());

        this.app.get('/', (req, res) => {
            res.status(200).json({ message: 'Welcome to the E-Commerce API!' });
        });

        this.app.use('/api/auth', authRouter.router);
        this.app.use('/api', apiRouter);
    }

    private initializeErrorHandling(): void {
        this.app.use((req, res, next) => {
            const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
            error.status = 404;
            next(error);
        });

        this.app.use(error);
    }
}
