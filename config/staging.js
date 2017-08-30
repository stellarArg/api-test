
const Config = require('./config');

class Staging extends Config {

  static configure(app) {
    super.configure(app);
    app.use(require('morgan')('dev'));
    app.use(require('cors')());
  }

}

module.exports = Staging;
