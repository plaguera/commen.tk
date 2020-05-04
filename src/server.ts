import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';

import routes from './routes';

class Server {
	public express: express.Application;

	constructor() {
		this.express = express();
		this.middleware();
		this.enableCors();
		this.routes();
	}

	enableCors() {
		const options: cors.CorsOptions = {
			allowedHeaders: [
				'Origin',
				'X-Requested-With',
				'Content-Type',
				'Accept',
				'X-Access-Token',
				'Authorization'
			],
			credentials: true,
			methods: 'GET,POST',
			origin: true,
			preflightContinue: false
		};
		console.log(process.cwd());
		this.express.use(cors(options));
		this.express.use(
			'/',
			express.static(path.join(process.cwd(), 'public'))
		);
	}

	middleware() {
		this.express.use(cookieParser(process.env.COOKIE_SECRET));
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: true }));
		this.express.use(compression());
		this.express.set('trust proxy', 1);
	}

	routes() {
		this.express.use('/', routes);
	}
}

export default new Server().express;
