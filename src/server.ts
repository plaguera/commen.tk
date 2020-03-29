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
                "Origin",
                "X-Requested-With",
                "Content-Type",
                "Accept",
                "X-Access-Token",
                "Authorization"
            ],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };
        this.express.use(cors(options));
        console.log(process.cwd())
        this.express.use('/public', express.static(path.join(process.cwd(), 'dist')))
    }

    middleware() {
        this.express.use(cookieParser());
        this.express.use(express.json());
        this.express.use(express.urlencoded({
            extended: false
        }));
    }

    routes() {
        this.express.use('/', routes);
    }
}

export default new Server().express;