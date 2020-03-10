import { User } from './user'
import { Repository } from './repository'
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const sendReponse = function (res, statusCode, data) {
    res.status(statusCode).json(data);
};

export class Controller {

    static user(req: Request, res: Response) {
        let user = new User(req.params.id || '');
        user.json('').then(result => {
            sendReponse(res, httpStatus.OK, result);
        }).catch((error) => {
            sendReponse(res, httpStatus.NOT_FOUND, null);
            console.error(error);
        });
    }

    static repo(req: Request, res: Response) {
        let repo = new Repository(req.params.user, req.params.repo);
        repo.json('').then(result => {
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
                (result as Array<Object>).sort((a, b) => { return a['number'] - b['number']; });
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
        let issuenumber = Number.parseInt(req.params.issuenumber);
        if (req.method == 'GET') {
            repo.comments(issuenumber).then(result => {
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

}