import mongoose from 'mongoose';
import { env } from './env';

export async function connectToDatabase(): Promise<void> {
	mongoose.set('strictQuery', true);
	await mongoose.connect(env.mongoUri);
}

export async function disconnectFromDatabase(): Promise<void> {
	await mongoose.disconnect();
}
