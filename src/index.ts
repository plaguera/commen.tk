import { Server } from './server'
import { graphql } from './request';

require('dotenv').config();

//get('users/plaguera');
//graphql('');


/*let port = process.env.PORT || '3040';
let server = new Server();
server.socket.listen(port, function () {
    console.log(`Listening on port ${port}`);
});*/

import express from 'express';
import routes from './routes/index';
// Instantiate express
const app = express();
// Set our port
const port = process.env.PORT || 8000;
// Configure app to user bodyParser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Register our routes in app
app.use('/', routes);
// Start our server
module.exports = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
