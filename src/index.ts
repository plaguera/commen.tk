require('dotenv').config();
import express from './server'

let port = process.env.PORT || '8000';
module.exports = express.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
