require('dotenv').config();
import express from './server'
import fs from 'fs';
import https from 'https';
import log from './logger';

log.debug('NODE_ENV', process.env.NODE_ENV);
log.debug('CWD\t', process.cwd());
let port = process.env.PORT || '8000';

switch (process.env.NODE_ENV) {
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