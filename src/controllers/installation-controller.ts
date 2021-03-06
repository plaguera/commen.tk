import { App } from '@octokit/app';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { Controller } from './controller';
import log from '../logger';

interface ExpirableValue<T> {
	value: T;
	expires: number;
}

export class InstallationController {

	static app: App;
	static jwt: ExpirableValue<string>;
	static tokens = {};
	static installationIds = {}

	static init(id: number, key: string) {
		InstallationController.app = new App({
			id: id,
			privateKey: key
		});
		InstallationController.jwt = { value: '', expires: new Date().getTime() }
		InstallationController.checkJWT();
	}

	static checkJWT() {
		const now = new Date().getTime();
		if (InstallationController.jwt.expires < now) {
			//log.debug('Generated new JWT');
			var tenminutesfromnow = new Date(now + (10 * 60 * 1000)).getTime();
			InstallationController.jwt.value = InstallationController.app.getSignedJsonWebToken();
			InstallationController.jwt.expires = tenminutesfromnow;
		}
	}

	static async getIAT(installationId: number) {
		const now = new Date().getTime();
		if (!InstallationController.tokens[installationId] || InstallationController.tokens[installationId].expires < now) {
			//log.debug('Requested Installation Access Token');
			const installationAccessToken = await InstallationController.app.getInstallationAccessToken({ installationId });
			const onehourfromnow = new Date(now + (60 * 60 * 1000));
			InstallationController.tokens[installationId] = { token: installationAccessToken, expires: onehourfromnow }
		}
		//log.debug('Installation Access Tokens', InstallationController.tokens);
		return InstallationController.tokens[installationId].token;
	}

	static async getIID(owner: string, repo: string) {
		if (InstallationController.installationIds[`${owner}/${repo}`])
			return InstallationController.installationIds[`${owner}/${repo}`];
		let url = `https://api.github.com/repos/${owner}/${repo}/installation`;
		//log.debug('Installation ID URL', url);
		const options = {
			headers: {
				authorization: `Bearer ${InstallationController.jwt.value}`,
				accept: 'application/vnd.github.machine-man-preview+json',
			}
		};
		const result = await fetch(url, options);
		const id = (await result.json()).id;
		InstallationController.installationIds[`${owner}/${repo}`] = id;
		//log.debug('Requested Installation ID', id);
		return id;
	}

	static async installation_access_token(req: Request, res: Response) {
		InstallationController.checkJWT();
		const installationId = await InstallationController.getIID(req.params.owner, req.params.repo);
		const installationAccessToken = await InstallationController.getIAT(installationId);
		Controller.checkCookie(req, res, 'installation_token', installationAccessToken, 60 * 60 * 1000);
		return installationAccessToken;
	}
}