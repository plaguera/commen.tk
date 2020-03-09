import express from 'express';
import cors from 'cors';
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
                "X-Access-Token"
            ],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };
        this.socket.use(cors(options));
    }

    dataBaseConnection() {
        //this.database.createConnection();
    }

    closedataBaseConnection(message: string, callback: any) {
        //this.database.closeConnection(message, () => callback());
    }

    middleware() {
        this.socket.use(express.json());
        this.socket.use(express.urlencoded({
            extended: true
        }));
    }

    routes() {
        this.socket.route("/").get((req, res) => {
            res.send({ result: "version 0.0.2" });
        });

        this.socket.route("/api/users").get(Controller.user);
        this.socket.route("/api/users/:id").get(Controller.user);
        this.socket.route("/api/repos/:user/:repo").get(Controller.repo);
        this.socket.route("/api/repos/:user/:repo/issues").get(Controller.issues);
        this.socket.route("/api/repos/:user/:repo/issues").post(Controller.issues);
        this.socket.route("/api/repos/:user/:repo/issues/:issuenumber/comments").get(Controller.comments);
        this.socket.route("/api/repos/:user/:repo/issues/:issuenumber/comments").post(Controller.comment);
        this.socket.route("/api/repos/:user/:repo/issues/comments/:comment_id").get(Controller.comment);
    }

}