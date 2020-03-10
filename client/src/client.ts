import express, { response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const options: cors.CorsOptions = {
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "X-Access-Token"
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: false
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const port = process.env.PORT || '8000';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/user', (req, res) => {
    res.render('user', { title: 'Profile', endpoint: 'http://localhost:3040/api/' });
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});