import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as ClientService from '../services/client.service';

export async function create(req: Request, res: Response, next: NextFunction) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const client = await ClientService.createClient(req.body);
		return res.status(201).json(client);
	} catch (err) { next(err); }
}

export async function list(req: Request, res: Response, next: NextFunction) {
	try {
		const { page, limit, status, q } = req.query as any;
		const filter: any = {};
		if (status) filter.status = status;
		if (q) filter.name = { $regex: String(q), $options: 'i' };
		const data = await ClientService.listClients(filter, { page: Number(page), limit: Number(limit) });
		return res.json(data);
	} catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
	try {
		const client = await ClientService.getClientById(req.params.id);
		return res.json(client);
	} catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const client = await ClientService.updateClient(req.params.id, req.body);
		return res.json(client);
	} catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
	try {
		await ClientService.deleteClient(req.params.id);
		return res.status(204).send();
	} catch (err) { next(err); }
}

export async function setStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const client = await ClientService.setClientStatus(req.params.id, req.body.status);
		return res.json(client);
	} catch (err) { next(err); }
}
