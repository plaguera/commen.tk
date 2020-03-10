import { Server } from './server'
import { Auth } from './auth';

require('dotenv').config();
Auth.validate();

let port = process.env.PORT || '3040';
let server = new Server();
server.socket.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

/*
    //"dev": "nodemon --watch 'src/**//*.ts' --exec ts-node src/index.ts", sobra // -> /
    //"start": "parcel serve src/*.html src/index.ts --port 4000",
    //"build": "parcel build src/*.html src/index.ts"
*/ 