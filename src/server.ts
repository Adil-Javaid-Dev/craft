import app from './app';
import { connectToDatabase } from './config/db';
import { env } from './config/env';

async function bootstrap() {
	await connectToDatabase();
	app.listen(env.port, () => {
		// eslint-disable-next-line no-console
		console.log(`Server listening on http://localhost:${env.port}`);
	});
}

bootstrap().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Failed to start server', err);
	process.exit(1);
});
