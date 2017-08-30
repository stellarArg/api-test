
const Config = require('./config');

class Prod extends Config {

  static configure(app) {
    super.configure(app);
    app.use(require('morgan')('tiny'));
  }

}

module.exports = Prod;
