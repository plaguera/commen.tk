import express from 'express';
import cors from 'cors';
import path from 'path';
var cookieParser = require('cookie-parser')

import { Controller } from './controller';

export class Server {

    public socket: express.Application;

    constructor() {
        this.socket = express();
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
        this.socket.use(cors(options));
        console.log(process.cwd())
        this.socket.use('/public', express.static(path.join(process.cwd(), 'dist/public')))
    }

    middleware() {
        this.socket.use(express.json());
        this.socket.use(express.urlencoded({
            extended: false
        }));
        this.socket.use(cookieParser())
    }

    routes() {
        this.socket.route("/").get((req, res) => {
            res.sendFile(path.join(process.cwd(), 'dist/public/index.html'));
        });

        this.socket.get('*', Controller.authorization);

        this.socket.route("/api/user").get(Controller.user);
        this.socket.route("/api/users/:id").get(Controller.user);
        this.socket.route("/api/users/:id/repos").get(Controller.repos);
        this.socket.route("/api/repos/:user/:repo").get(Controller.repo);
        this.socket.route("/api/repos/:user/:repo/issues").get(Controller.issues);
        this.socket.route("/api/repos/:user/:repo/issues").post(Controller.issues);
        this.socket.route("/api/repos/:user/:repo/issues/:issue_number").get(Controller.issue);
        this.socket.route("/api/repos/:user/:repo/issues/:issuenumber/comments").get(Controller.comments);
        this.socket.route("/api/repos/:user/:repo/issues/:issuenumber/comments").post(Controller.comment);
        this.socket.route("/api/repos/:user/:repo/issues/comments/:comment_id").get(Controller.comment);
        this.socket.route("/api/markdown").post(Controller.markdown);
        this.socket.route("/authorize").get(Controller.authorize);
        this.socket.route("/oauth/redirect").get(Controller.access_token);
    }

}