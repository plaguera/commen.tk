import { Controller } from './controller';
import { query } from '../request';

export class RepositoryController extends Controller {
	static get(owner: string, repo: string, token:string) {
		let data = `{
            repository(name: "${repo}", owner: "${owner}") {
				id
            }
        }`;
		return query(data, token);
	}
}