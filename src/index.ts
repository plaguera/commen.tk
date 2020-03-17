import { Server } from './server'

require('dotenv').config();

let port = process.env.PORT || '3040';
let server = new Server();
server.socket.listen(port, function () {
    console.log(`Listening on port ${port}`);
});