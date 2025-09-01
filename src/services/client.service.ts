import createHttpError from 'http-errors';
import { ClientModel, Client } from '../models/Client';
import { FilterQuery, UpdateQuery } from 'mongoose';

export type CreateClientInput = Pick<Client, 'name' | 'email' | 'phone'> & Partial<Pick<Client, 'status'>>;
export type UpdateClientInput = Partial<Pick<Client, 'name' | 'email' | 'phone' | 'status'>>;

export async function createClient(input: CreateClientInput): Promise<Client> {
	const existing = input.email ? await ClientModel.findOne({ email: input.email }) : null;
	if (existing) {
		throw new createHttpError.Conflict('Client with this email already exists');
	}
	const client = await ClientModel.create({ ...input });
	return client;
}

export async function getClientById(id: string): Promise<Client> {
	const client = await ClientModel.findById(id);
	if (!client) throw new createHttpError.NotFound('Client not found');
	return client;
}

export async function listClients(filter: FilterQuery<Client> = {}, options: { page?: number; limit?: number } = {}) {
	const page = Math.max(1, options.page || 1);
	const limit = Math.min(100, Math.max(1, options.limit || 20));
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		ClientModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
		ClientModel.countDocuments(filter)
	]);
	return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function updateClient(id: string, update: UpdateClientInput): Promise<Client> {
	const client = await ClientModel.findByIdAndUpdate(id, update as UpdateQuery<Client>, { new: true });
	if (!client) throw new createHttpError.NotFound('Client not found');
	return client;
}

export async function deleteClient(id: string): Promise<void> {
	const result = await ClientModel.findByIdAndDelete(id);
	if (!result) throw new createHttpError.NotFound('Client not found');
}

export async function setClientStatus(id: string, status: 'active' | 'inactive'): Promise<Client> {
	const client = await ClientModel.findByIdAndUpdate(id, { status }, { new: true });
	if (!client) throw new createHttpError.NotFound('Client not found');
	return client;
}
