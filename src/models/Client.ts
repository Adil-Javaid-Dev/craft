import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Client extends Document {
	name: string;
	email?: string;
	phone?: string;
	status: 'active' | 'inactive';
	createdAt: Date;
	updatedAt: Date;
}

const ClientSchema: Schema<Client> = new Schema<Client>({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: false, trim: true, lowercase: true },
	phone: { type: String, required: false, trim: true },
	status: { type: String, enum: ['active', 'inactive'], default: 'inactive', index: true }
}, { timestamps: true });

ClientSchema.index({ name: 1 }, { unique: false });

export const ClientModel: Model<Client> = mongoose.models.Client || mongoose.model<Client>('Client', ClientSchema);
