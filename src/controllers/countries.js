const {Country} = include('models');

class CountriesController {
    static async fetch(req, res, next) {
        try {
            const countries = await Country.find(req.query);

            res.locals = {countries};
            return next();
        } catch(err) {
            next(err);
        }
    }
}

module.exports = CountriesController;
