import cookieParser from 'cookie-parser';
import session from 'express-session';
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
		this.express.use(cors(options));
		console.log(process.cwd());
		this.express.use(
			'/public',
			express.static(path.join(process.cwd(), 'public'))
		);
	}

	middleware() {
		this.express.use(cookieParser());
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: true }));
		this.express.set('trust proxy', 1);
		this.express.use(
			session({
				secret: 'keyboard cat',
				resave: false,
				saveUninitialized: true,
				cookie: { secure: true }
			})
		);
	}

	routes() {
		this.express.use('/', routes);
	}
}

export default new Server().express;
