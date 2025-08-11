import mongoose from 'mongoose';
import config from './config/config';

export const connectDB = async () => {
    try {
        const { host, user, pass, name } = config.db;

        if (!host || !user || !pass || !name) {
            console.error('FATAL ERROR: Database credentials are not fully defined in the environment variables.');
            process.exit(1);
        }

        const connectionString = `mongodb+srv://${user}:${pass}@${host}/${name}?retryWrites=true&w=majority`;

        await mongoose.connect(connectionString);
        console.log('MongoDB Connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};