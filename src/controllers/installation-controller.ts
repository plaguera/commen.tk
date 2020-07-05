import { App } from '@octokit/app';
import { Request, Response, CookieOptions } from 'express';
import fetch from 'node-fetch';
export class InstallationController {

	static jwt: string;
	static app: App;

	static init(id: number, key: string) {
		InstallationController.app = new App({
			id: id,
			privateKey: key
		});
		InstallationController.jwt = InstallationController.app.getSignedJsonWebToken();
	}

	static async installation_access_token(req: Request, res: Response) {
		let url = `https://api.github.com/repos/${req.params.owner}/${req.params.repo}/installation`;
		const options = {
			headers: {
				authorization: `Bearer ${InstallationController.jwt}`,
				accept: 'application/vnd.github.machine-man-preview+json',
			}
		};
		
		const result = await fetch(url, options);
		const installationId = (await result.json()).id;
		const installationAccessToken = await InstallationController.app.getInstallationAccessToken({ installationId });

		console.log(process.env.NODE_ENV)
		if (process.env.NODE_ENV === 'PRODUCTION') {
			let cookie = req.signedCookies.installation_token;
			if (cookie === undefined) {
				console.log('CREATE COOKIE - INSTALLATION TOKEN');
				let options : CookieOptions = {
					httpOnly: true,
					maxAge: 10 * 60 * 1000,
					sameSite: 'none',
					secure: true,
					signed: true
				};
				res.cookie('installation_token', installationAccessToken, options);
			}
		} else if (process.env.NODE_ENV === 'DEVELOPMENT') {
			let cookie = req.signedCookies.installation_token;
			if (cookie === undefined) {
				console.log('CREATE COOKIE - INSTALLATION TOKEN');
				let options : CookieOptions = {
					httpOnly: true,
					maxAge: 10 * 60 * 1000,
					signed: true
				};
				res.cookie('installation_token', installationAccessToken, options);
			}
		}
		return installationAccessToken;
	}
}