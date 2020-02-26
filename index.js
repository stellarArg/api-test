const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const Routers = require('./src/routes');

const app = express();

app.use(bodyParser.json({limit: "3mb"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    credentials: true,
    origin: /^http:\/\/localhost/
}));

Routers(app);

app.listen(5000, () => console.log('App running on port 5000'));
app.on('error', err => console.log(err));
