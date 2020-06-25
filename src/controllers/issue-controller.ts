import { Request, Response } from 'express';
import { Controller } from './controller';
import { query } from '../request';
import { InstallationController } from './installation-controller';
import { RepositoryController } from './repository-controller';

export class IssueController extends Controller {

	static get(owner: string, repo: string, number: number, token: string) {
		let data = `{
            repository(name: "${repo}", owner: "${owner}") {
              issue(number: ${number}) {
                id
              }
            }
          }`;
		return query(data, token);
	}

	static post(repoid: string, name: string, token: string) {
		let data = `mutation {
						__typename
						createIssue(input: {repositoryId: "${repoid}", title: "${name}"}) {
							clientMutationId
							issue {
								id
								number
							}
						}
					}`;
		return query(data, token);
	}

	static searchIssueName(owner: string, repo: string, name: string, token: string) {
		let data = `{
			search(query: "'${name}' in:title repo:${owner}/${repo}", type: ISSUE, last: 1) {
				issueCount
				nodes {
					... on Issue {
						number
						repository {
							id
						}
					}
				}
			}
		}`;
		return query(data, token);
	}

	static async processIssueName(req: Request, res: Response) {
		let token = await InstallationController.accessToken(req.params.owner, req.params.repo);
		let search = await IssueController.searchIssueName(req.params.owner, req.params.repo, req.params.name, token);
		console.log(search.data.search);
		if (search.data.search.issueCount == 0) {
			let repo = await RepositoryController.get(req.params.owner, req.params.repo, token);
			let issue = await IssueController.post(repo.data.repository.id, req.params.name, token);
			IssueController.sendResponse(res, issue.status, issue.data);
		} else {
			IssueController.sendResponse(res, search.status, search.data);
		}
	}
}
