import { Request, Response } from 'express';
import { Controller } from './controller';
import { RequestParameters } from '@octokit/graphql/dist-types/types';

/**
 * Controller in charge of user and viewer requests.
 */
export class UserController extends Controller {
    /**
     * Returns information of @id user, if no @id is specified, of the user whose credentials are being used.
     * @param req Request
     * @param res Response
     */
    static async get(req: Request, res: Response) {
        let query: RequestParameters;
        if (req.params.id) {
            query = {
                query: `query GETuser ($id: String!) {
                    user(login: $id) {
                        login,
                        url,
                        avatarUrl
                    }
                }`,
                id: req.params.id
            };
        } else {
            query = {
                query: `query GETviewer ($body: String!) {
                    viewer {
                        login,
                        url,
                        avatarUrl
                    }
                }`
            };
        }
        Controller.graphql(req, res, query);
        // TODO : Check behaviour of viewer when no token
        //if (!req.params.id && !req.signedCookies.token)
            //Controller.sendResponse(res, 200, { data: { viewer: undefined } })
    }
}