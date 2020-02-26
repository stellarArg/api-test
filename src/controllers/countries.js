const find = require('lodash/find');

class CountriesController {
    static fetch(req, res, next) {
        const countries = require('../data/countries.json');
        
        if (req.query) {
            // Hagan algo para filtrar datos
        }
        res.send(countries);
    }
}

module.exports = CountriesController;
