import dotenv from 'dotenv';
dotenv.config();

type Config = {
    port: number;
    nodeEnv: string;
    db: {
        host: string | undefined;
        user: string | undefined;
        pass: string | undefined;
        name: string | undefined;
    };
    jwtSecret: string | undefined;
};

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        name: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
};

export default config;