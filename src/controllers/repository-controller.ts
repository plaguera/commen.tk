import { Controller } from './controller';
import { RequestParameters } from '@octokit/graphql/dist-types/types';
import { Request, Response } from 'express';

/**
 * Controller in charge of repository requests.
 */
export class RepositoryController extends Controller {
	static repoIds = {};
	/**
	 * Returns repository id.
	 * @param owner Repository Owner
	 * @param repo Repository Name
	 * @param token Access Token
	 */
	static async get(req: Request, res: Response) {
		if (RepositoryController.repoIds[`${req.params.owner}/${req.params.repo}`])
			return RepositoryController.repoIds[`${req.params.owner}/${req.params.repo}`];
		let query: RequestParameters = {
			query: `query repoID ($repo: String!, $owner: String!) {
				repository(name: $repo, owner: $owner) {
					id
				}
			}`,
			owner: req.params.owner,
			repo: req.params.repo
		};
		const result = await Controller.graphql(req, res, query, true);
		RepositoryController.repoIds[`${req.params.owner}/${req.params.repo}`] = result.repository.id;
		return result.repository.id;
	}
}