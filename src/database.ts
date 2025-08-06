import mongoose from 'mongoose';
import config from './config/config';

export const connectDB = async () => {
    try {

        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};