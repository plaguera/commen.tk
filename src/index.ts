require('dotenv').config();
import express from './server'
import fs from 'fs';
import https from 'https';
import log from './logger';
import env from './environment';

log.debug('NODE_ENV', env.node_env);
log.debug('CWD\t', env.cwd);
let port = env.port || '8000';

switch (env.node_env) {
    case 'DEVELOPMENT': httpServer(); break;
    case 'PRODUCTION': httpsServer(); break;
}

/**
 * Creates a HTTPS server using a domain private key and  certificate on port @port
 * Used in production.
 */
function httpsServer() {
	https.createServer({
		key: fs.readFileSync('/etc/letsencrypt/live/api.commen.tk/privkey.pem'),
		cert: fs.readFileSync('/etc/letsencrypt/live/api.commen.tk/cert.pem'),
	}, express).listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
}

/**
 * Creates a HTTP server on port @port
 * Used in only in development and testing environments.
 */
function httpServer() {
	express.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
}