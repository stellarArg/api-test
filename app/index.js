
const
  dotenv = require('dotenv'),
  express = require('express');

const app = express();

dotenv.load();

const
  Config = require(`../config/${process.env.NODE_ENV}`),
  Router = require('./routes');

Config.configure(app);
Router.configure(app);

module.exports = app;
