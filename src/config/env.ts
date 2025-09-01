import dotenv from 'dotenv';
dotenv.config();

export const env = {
	port: process.env.PORT ? Number(process.env.PORT) : 4000,
	mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/client_db'
};
