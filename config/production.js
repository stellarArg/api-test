const Config = require('./config');

class Prod extends Config {
    static configure(app) {
        super.configure(app);
        app.use(require('morgan')('combined'));
        app.use(require('cors')());
    }
}

module.exports = Prod;
