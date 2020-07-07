import { Request, Response } from 'express';
import { Controller } from './controller';
import { InstallationController } from './installation-controller';
import { RepositoryController } from './repository-controller';
import { RequestParameters } from '@octokit/graphql/dist-types/types';

export class IssueController extends Controller {

	static async get(req: Request, res: Response) {
		let query: RequestParameters = {
			query: `query issueID ($repo: String!, $owner: String!, $number: Int!) {
				repository(name: $repo, owner: $owner) {
					issue(number: $number) {
						id
					}
				}
			}`,
			owner: req.params.owner,
			repo: req.params.repo,
			number: parseInt(req.params.issue)
		};
		const result = await Controller.graphql(req, res, query, true);
		return result.repository.issue.id;
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
					// TODO : FIX THIS
		//return query(data, token);
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
		// TODO : FIX THIS
		//return query(data, token);
	}

	static async processIssueName(req: Request, res: Response) {
		let token = await InstallationController.installation_access_token(req, res);
		let search = await IssueController.searchIssueName(req.params.owner, req.params.repo, req.params.name, token);
		/*if (search.data.search.issueCount == 0) {
			let repo = await RepositoryController.get(req.params.owner, req.params.repo, token);
			let issue = await IssueController.post(repo.data.repository.id, req.params.name, token);
			IssueController.sendResponse(res, issue.status, issue.data);
		} else {
			IssueController.sendResponse(res, search.status, search.data);
		}*/
	}
}
