import { Controller } from './controller';
import { query } from '../request';

/**
 * Controller in charge of repository requests.
 */
export class RepositoryController extends Controller {
	/**
	 * Returns repository id.
	 * @param owner Repository Owner
	 * @param repo Repository Name
	 * @param token Access Token
	 */
	static get(owner: string, repo: string, token:string) {
		let data = `{
            repository(name: "${repo}", owner: "${owner}") {
				id
            }
        }`;
		return query(data, token);
	}
}