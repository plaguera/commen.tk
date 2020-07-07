import { Request, Response } from 'express';
import { Controller } from './controller';
import { InstallationController } from './installation-controller';
import { RepositoryController } from './repository-controller';
import { RequestParameters } from '@octokit/graphql/dist-types/types';

export class IssueController extends Controller {

	static async get(req: Request, res: Response) {
		let query: RequestParameters = {
			query: `query GETissueID ($repo: String!, $owner: String!, $number: Int!) {
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

	static async post(req: Request, res: Response) {
		let repoid = req.params.repoid;
		if (!repoid)
			repoid = await RepositoryController.get(req, res);
		let query: RequestParameters = {
			query: `mutation POSTissue ($id: String!, $title: String!) {
				__typename
				createIssue(input: {repositoryId: $id, title: $title}) {
					clientMutationId
					issue {
						id
						number
					}
				}
			}`,
			id: repoid,
			title: req.body.title
		};
		const result = await Controller.graphql(req, res, query);
		return result.createIssue.issue.id;
	}

	static async delete(req: Request, res: Response) {
		let query: RequestParameters = {
			query: `mutation DELETEissue ($id: String!) {
				__typename
				deleteIssue(input: {issueId: $id}) {
					clientMutationId
				}
			}`,
			id: req.params.id
		};
		Controller.graphql(req, res, query);
	}

	static async searchIssueName(req: Request, res: Response) {
		let query: RequestParameters = {
			query: `query SEARCHissue ($repo: String!, $owner: String!, $issue: String!) {
				search(query: "'$issue' in:title repo:$owner/$repo", type: ISSUE, last: 1) {
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
			}`,
			owner: req.params.owner,
			repo: req.params.repo,
			issue: req.params.issue
		};
		// TODO : check query search output
		const result = await Controller.graphql(req, res, query, true);
		return result.createIssue.issue.id;
	}

	static async processIssueName(req: Request, res: Response) {
		let token = await InstallationController.installation_access_token(req, res);
		/*let search = await IssueController.searchIssueName(req.params.owner, req.params.repo, req.params.name, token);
		if (search.data.search.issueCount == 0) {
			let repo = await RepositoryController.get(req.params.owner, req.params.repo, token);
			let issue = await IssueController.post(repo.data.repository.id, req.params.name, token);
			IssueController.sendResponse(res, issue.status, issue.data);
		} else {
			IssueController.sendResponse(res, search.status, search.data);
		}*/
	}
}
