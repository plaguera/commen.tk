import fetch from 'node-fetch';
import { Controller } from './controller';
import { App } from '@octokit/app';

export class InstallationController extends Controller {

	static jwt: string;
	static app: App;

	static init(id: number, key: string) {
		InstallationController.app = new App({
			id: id,
			privateKey: key
		});
		InstallationController.jwt = InstallationController.app.getSignedJsonWebToken();
	}

	static async accessToken(owner: string, repo: string) {
		let url = `https://api.github.com/repos/${owner}/${repo}/installation`;
		const options = {
			headers: {
				authorization: `Bearer ${InstallationController.jwt}`,
				accept: 'application/vnd.github.machine-man-preview+json',
			}
		};
		const result = await fetch(url, options);
		const installationId = (await result.json()).id;
		const installationAccessToken = await InstallationController.app.getInstallationAccessToken({ installationId });
		return installationAccessToken;
	}

	static async get(url: string, token: string) {
		const options = {
			headers: {
				Accept: 'application/json',
				authorization: `token ${token}`,
			},
			method: 'GET'
		};
	
		let res = await fetch(url, options);
		if (res.headers.get('content-type')?.includes('application/json')) return await res.json();
		return res;
	}
}