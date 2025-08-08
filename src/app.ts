import express, { Application, Router } from 'express';
import config from './config/config';
import { errorHandler } from './middlewares/error.handler';
import { ProductRouter } from './routers/product.router';
import { UserRouter } from './routers/user.router';
import { OrderRouter } from './routers/order.router';
import cookieParser from 'cookie-parser';
import { AuthRouter } from './routers/auth.router';

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
            console.log(`Environment: ${config.nodeEnv}`);
        });
    }

    private initializeMiddleware(): void {
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    private initializeRoutes(): void {
        const productRouter = new ProductRouter();
        const userRouter = new UserRouter();
        const orderRouter = new OrderRouter();
        const authRouter = new AuthRouter();

        this.app.get('/', (req, res) => {
            res.status(200).json({ message: 'Welcome to the E-Commerce API! Server is running.' });
        });
        this.app.use('/api/auth', authRouter.router)
        this.app.use('/api/products', productRouter.router);
        this.app.use('/api/users', userRouter.router);
        this.app.use('/api/orders', orderRouter.router);
    }

    private initializeErrorHandling(): void {
        this.app.use(errorHandler);
    }
}