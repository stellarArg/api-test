const map = require('lodash/map');

class StatesController {
    static fetch(req, res, next) {
        try {
            // eslint-disable-next-line
            map(res.locals.countries, country => {
                country.states = ['fake-states'];
            });
            res.send(res.locals.countries);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = StatesController;
