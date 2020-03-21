const querystring = require('querystring');

import httpStatus from 'http-status';
import { OAuth } from './oauth';
import { Repository } from './repository'
import { Request, Response } from 'express';
import { User } from './user'
import { Markdown } from './markdown';

const sendReponse = function (res: Response<any>, statusCode: number, data: object | null) {
    //console.log(data);
    res.status(statusCode).json(data);
};

const sendReponseText = function (res: Response<any>, statusCode: number, data: string | void) {
    res.status(statusCode).send(data);
};

export class Controller {

    static oauth: OAuth = new OAuth;

    static authorization(req: Request, res: Response, next){
        if (req.cookies['token'])
            Controller.oauth.accessToken = JSON.parse(req.cookies['token'])['access_token'];
        next();
    }
    
    static user(req: Request, res: Response) {
        let user = new User(req.params.id || '');
        user.get().then(result => {
            sendReponse(res, httpStatus.OK, result);
        }).catch((error) => {
            sendReponse(res, httpStatus.NOT_FOUND, null);
            console.error(error);
        });
    }

    static repos(req: Request, res: Response) {
        let user = new User(req.params.id || '');
        user.repos().then(result => {
            sendReponse(res, httpStatus.OK, result);
        }).catch((error) => {
            sendReponse(res, httpStatus.NOT_FOUND, null);
            console.error(error);
        });
    }

    static repo(req: Request, res: Response) {
        let repo = new Repository(req.params.user, req.params.repo);
        repo.get().then(result => {
            sendReponse(res, httpStatus.OK, result);
        }).catch((error) => {
            sendReponse(res, httpStatus.NOT_FOUND, null);
            console.error(error);
        });
    }

    static issue(req: Request, res: Response) {
        let repo = new Repository(req.params.user, req.params.repo);
        repo.issue(Number.parseInt(req.params.issue_number)).then(result => {
            sendReponse(res, httpStatus.OK, result);
        }).catch((error) => {
            sendReponse(res, httpStatus.NOT_FOUND, null);
            console.error(error);
        });
    }

    static issues(req: Request, res: Response) {
        let repo = new Repository(req.params.user, req.params.repo);
        if (req.method == 'GET') { 
            repo.issues().then(result => {
                sendReponse(res, httpStatus.OK, result);
            }).catch((error) => {
                sendReponse(res, httpStatus.NOT_FOUND, null);
                console.error(error);
            });
        } else if (req.method == 'POST') {
            repo.create_issue(req.body).then(result => {
                sendReponse(res, httpStatus.OK, result);
            }).catch((error) => {
                sendReponse(res, httpStatus.NOT_FOUND, null);
                console.error(error);
            });
        }
    }

    static comments(req: Request, res: Response) {
        let repo = new Repository(req.params.user, req.params.repo);
        console.log(req.params.user + '/' + req.params.repo);
        let issuenumber = Number.parseInt(req.params.issuenumber);
        if (req.method == 'GET') {
            repo.comments(issuenumber).then(result => {
                console.log(result);
                sendReponse(res, httpStatus.OK, result);
            }).catch((error) => {
                sendReponse(res, httpStatus.NOT_FOUND, null);
                console.error(error);
            });
        }
    }

    static comment(req: Request, res: Response) {
        let repo = new Repository(req.params.user, req.params.repo);
        if (req.method == 'GET') {
            let comment_id = Number.parseInt(req.params.comment_id);
            repo.comment(comment_id).then(result => {
                sendReponse(res, httpStatus.OK, result);
            }).catch((error) => {
                sendReponse(res, httpStatus.NOT_FOUND, null);
                console.error(error);
            });
        } else if (req.method == 'POST') {
            let issuenumber = Number.parseInt(req.params.issuenumber);
            repo.create_comment(issuenumber, req.body).then(result => {
                sendReponse(res, httpStatus.OK, result);
            }).catch((error) => {
                sendReponse(res, httpStatus.NOT_FOUND, null);
                console.error(error);
            });
        }
    }

    static async authorize(req: Request, res: Response) {
        res.redirect(Controller.oauth.authorize(req.headers.referer));
    }

    static async access_token(req: Request, res: Response) {
        Controller.oauth.access_token(req.query.code).then(result => {
            res.redirect(Controller.oauth.redirectURI + '?' + querystring.stringify(result));
        }).catch((error) => console.error(error));
    }

    static async markdown(req: Request, res: Response) {
        Markdown.render(req.body).then(result => sendReponseText(res, httpStatus.OK, result));
    }

}