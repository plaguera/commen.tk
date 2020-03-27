import { Request, Response } from 'express';
import { Controller } from './controller';
import { graphql } from '../request';

export class UserController extends Controller {
    static get(req: Request, res: Response) {
        let obj = req.params.id ? `user(login: "${req.params.id}")` : 'viewer';
        let query = `{
            ${obj} {
                login,
                url,
                avatarUrl
            }
        }`;
        graphql(query).then(api => UserController.sendResponse(res, api.status, api.data));
    }
}