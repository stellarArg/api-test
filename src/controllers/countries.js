const {Country} = include('models');

class CountriesController {
    static async fetch(req, res, next) {
        try {
            const countries = await Country.find(req.query);
            const total = await Country.countDocuments();
            console.log(total);
            res.send({
                countries,
                total: 174,
                limit: process.env.PAGE_SIZE
            });
        } catch(err) {
            next(err);
        }
    }
}

module.exports = CountriesController;
