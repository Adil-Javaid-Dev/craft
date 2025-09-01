import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
	next(new createHttpError.NotFound('Route not found'));
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	if (process.env.NODE_ENV !== 'test') {
		// eslint-disable-next-line no-console
		console.error(err);
	}
	res.status(status).json({ message, status });
}
