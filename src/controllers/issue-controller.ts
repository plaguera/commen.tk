import { Request, Response } from 'express';
import { Controller } from './controller';
import { RepositoryController } from './repository-controller';
import { RequestParameters } from '@octokit/graphql/dist-types/types';
import log from '../logger';

export class IssueController extends Controller {

	static issueIds = {};

	static async get(req: Request, res: Response) {
		if (IssueController.issueIds[`${req.params.owner}/${req.params.repo}/${req.params.issue}`])
			return IssueController.issueIds[`${req.params.owner}/${req.params.repo}/${req.params.issue}`];
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
		IssueController.issueIds[`${req.params.owner}/${req.params.repo}/${req.params.issue}`] = result.repository.issue.id;
		return result.repository.issue.id;
	}

	static async post(req: Request, res: Response) {
		let repoid = req.params.id;
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
						url
						repository {
							id
						}
					}
				}
			}`,
			id: repoid,
			title: req.body.title
		};
		const result = await Controller.graphql(req, res, query);
		return result.createIssue.issue;
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
			query: `query SEARCHissue ($search: String!) {
				search(query: $search, type: ISSUE, last: 1) {
					issueCount
					nodes {
						... on Issue {
							id
							number
							url
							repository {
								id
							}
						}
					}
				}
			}`,
			search: `'${req.params.name}' in:title repo:${req.params.owner}/${req.params.repo}`
		};
		const result = await Controller.graphql(req, res, query, true);
		return result.search;
	}

	static async processIssueName(req: Request, res: Response) {
		let token = await Controller.installationToken(req, res);
		let search = await IssueController.searchIssueName(req, res);
		let issue: any;
		if (search.issueCount == 0) {
			req.params.repoid = await RepositoryController.get(req, res);
			req.body.title = req.params.name;
			// TODO : Fix post already sends response
			issue = await IssueController.post(req, res);
		} else {
			issue = search.nodes[0];
		}
		IssueController.sendResponse(res, 200, issue);
	}
}
