import express from './server'

require('dotenv').config();

let port = process.env.PORT || '8000';
module.exports = express.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
