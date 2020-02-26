import { Request, RequestInit, HeadersInit } from 'node-fetch';
import fetch from "node-fetch";

const GITHUB_ENDPOINT = 'https://api.github.com/';
const token = `6ed125f6941d18de564195160615f99890e08f87`;
let owner = 'ULL-ESIT-GRADOII-TFG';
let repo = 'utterances';

export async function loadIssue(issueNumber: number) {
    const request = githubRequest(`repos/${owner}/${repo}/issues/${issueNumber}`);
    const response = await githubFetch(request);
    if (!response.ok)
        throw new Error('Error fetching issues !!!');
    return response.json();
}

export function loadIssues() {
    const request = githubRequest(`repos/${owner}/${repo}/issues`);
    return githubFetch(request).then(response => { return response.json() });
}

function githubRequest(relativeUrl: string) {
    let request = new Request(GITHUB_ENDPOINT + relativeUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${token}`
        }
    });
    console.log(request);
    return request;
}

function githubFetch(request: Request): Promise<Response> {
    return fetch(request)
        .then(response => { return response.json() })
        .catch(error => console.error(error));
}

export interface Issue {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    number: number;
    title: string;
    user: User;
    locked: boolean;
    labels: {
        url: string;
        name: string;
        color: string;
    }[];
    state: string;
    assignee: null;
    milestone: null;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at: null;
    pull_request: {
        html_url: null;
        diff_url: null;
        patch_url: null;
    };
    body: string;
    score: number;
    author_association: CommentAuthorAssociation;
}

export interface IssueComment {
    id: number;
    url: string;
    html_url: string;
    body_html: string;
    user: User;
    created_at: string;
    updated_at: string;
    author_association: CommentAuthorAssociation;
}

export interface User {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
}

export type CommentAuthorAssociation =
    'COLLABORATOR'
    | 'CONTRIBUTOR'
    | 'FIRST_TIMER'
    | 'FIRST_TIME_CONTRIBUTOR'
    | 'MEMBER'
    | 'NONE'
    | 'OWNER';