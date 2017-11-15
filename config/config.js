class Config {
    static configure(app) {
        app.use(require('body-parser').json());
        app.use(require('body-parser').urlencoded({extended: true}));

        app.use(require('cookie-parser')());
        app.use(require('morgan')('combined'));

        require('node-friendly-response');

        require('../app/helpers/mongoose').configure();
    }
}

module.exports = Config;
