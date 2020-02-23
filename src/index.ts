import express from 'express';
import fetch from "node-fetch"

const app = express();
const port = process.env.PORT || '3000';
const token = `6ed125f6941d18de564195160615f99890e08f87`;
const endpoint = 'https://api.github.com'
// /user/repos
// /repos/ULL-ESIT-GRADOII-TFG/utterances/issues
fetch(endpoint + '/repos/ULL-ESIT-GRADOII-TFG/utterances/issues', {
    method: 'GET',
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "token " + token,
    },
}).then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(error => console.error(error))

app.listen(port, err => {
    if (err) return console.error(err);
    return console.log(`Server is listening on ${port}`);
});