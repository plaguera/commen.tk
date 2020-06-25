require('dotenv').config();
import express from './server'
import fs from 'fs';
import https from 'https';
import { InstallationController } from './controllers/installation-controller';
import { IssueController } from './controllers/issue-controller';

console.log(process.env.NODE_ENV);
console.log(process.cwd());
let port = process.env.PORT || '8000';

InstallationController.init(
    parseInt(process.env.GITHUB_APP_IDENTIFIER || ''),
    fs.readFileSync('/Users/pedro/Drive/' + process.env.GITHUB_APP_PRIVATE_KEY).toString()
);
InstallationController.accessToken('plaguera', 'tfm-testing').then((token) => {
    //InstallationController.get('https://api.github.com/repos/plaguera/commen.tk', token).then(console.log);
    //InstallationController.get('https://api.github.com/users/plaguera', token).then(console.log);
    IssueController.processIssueName('plaguera', 'tfm-testing', 'Issue #5', token);
});
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