const {Country} = include('models');

class CountriesController {
    static async fetch(req, res, next) {
        try {
            const countries = await Country.find(req.query);
            const [{count}] = await Country.countDocuments();
            res.send({
                countries,
                total: count || 174,
                limit: parseInt(process.env.PAGE_SIZE)
            });
        } catch(err) {
            next(err);
        }
    }
}

module.exports = CountriesController;
