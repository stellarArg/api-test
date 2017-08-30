
const
  dotenv = require('dotenv'),
  express = require('express');

const app = express();

dotenv.load();

const
  Config = require(`../config/${process.env.NODE_ENV}`);

Config.configure(app);

module.exports = app;
