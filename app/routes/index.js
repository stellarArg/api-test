
const
  jwt = require('express-jwt'),
  apiRouter = require('./api');

const authenticate = jwt({
  secret: new Buffer(process.env.AUTH_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH_CLIENT_ID
});


class Router {

  static configure(app) {
    app.use('/api', authenticate, apiRouter);
  }

}

module.exports = Router;
