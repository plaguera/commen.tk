import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import { InstallationController } from './controllers/installation-controller';
import morgan from 'morgan';
import routes from './routes';
class Server {
	public express: express.Application;

	constructor() {
		this.express = express();
		this.middleware();
		this.enableCors();
		this.routes();
		this.installationController();
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
	}

	middleware() {
		this.express.use(cookieParser(process.env.COOKIE_SECRET));
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: true }));
		this.express.use(compression());
		this.express.use(morgan('combined'));
		this.express.set('trust proxy', 1);
	}

	routes() {
		this.express.use('/', routes);
	}

	installationController() {
		if (process.env.NODE_ENV === 'DEVELOPMENT') return;
		InstallationController.init(
			parseInt(process.env.GITHUB_APP_IDENTIFIER || ''),
			fs.readFileSync(process.env.GITHUB_APP_PRIVATE_KEY_PATH || '').toString()
		);
	}
}

export default new Server().express;
