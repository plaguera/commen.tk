import { Server } from './server'
import { Auth } from './auth';
import { OAuth } from './oauth';

require('dotenv').config();
Auth.validate();

let port = process.env.PORT || '3040';
let server = new Server();
server.socket.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); })