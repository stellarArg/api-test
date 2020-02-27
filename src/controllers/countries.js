// eslint-disable-next-line
const find = require('lodash/find');

class CountriesController {
    static fetch(req, res, next) {
        try {
            const countries = require('../data/countries.json');

            if (req.query.filter) {
            // Hagan algo para filtrar datos
            }
            res.send(countries);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = CountriesController;
