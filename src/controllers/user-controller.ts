import { Request, Response } from 'express';
import { Controller } from './controller';
import { query } from '../request';

export class UserController extends Controller {
    static get(req: Request, res: Response) {
        let obj = req.params.id ? `user(login: "${req.params.id}")` : 'viewer';
        let data = `{
            ${obj} {
                login,
                url,
                avatarUrl
            }
        }`;
        if (!req.params.id && !req.signedCookies.token)
            UserController.sendResponse(res, 200, { data: { viewer: undefined } })
        else {
            let token = req.params.id ? req.signedCookies.token || process.env.DEFAULT_GITHUB_TOKEN : req.signedCookies.token;
            res.set('Cache-Control', 'max-age=600');
            query(data, token).then(api => UserController.sendResponse(res, api.status, api.data));
        }
    }
}