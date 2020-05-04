require('dotenv').config();
import express from './server'
import fs from 'fs';
import https from 'https';

console.log(process.env.NODE_ENV);
console.log(process.cwd());
let port = process.env.PORT || '8000';
switch (process.env.NODE_ENV) {
    case 'DEVELOPMENT': httpServer(); break;
    case 'PRODUCTION': httpsServer(); break;
}

function httpsServer() {
    https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/api.commen.tk/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/api.commen.tk/cert.pem'),
    }, express).listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

function httpServer() {
    express.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}
