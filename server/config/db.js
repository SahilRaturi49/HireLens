import mongoose from 'mongoose';
import logger from '../utils/logger.js';

let _isConnected = false;

export async function connect(){
    if(_isConnected){
        logger.info("MongoDB already connected.")
        return;
    };

    try {
        await mongoose.connect(process.env.MONGO_URI);
        _isConnected = true;
        logger.info("MongoDB connection successful.")
    } catch (error) {
        logger.error("MongoDB connection failed", error);
        throw error;
    }

}