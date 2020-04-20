const {Persons} = include('models');

class CountryController {
    static async fetch(req, res, next) {
        try {
            const persons = await Persons.find(req.query);
            res.send(persons);
        } catch (error) {
            next(error);
        }
    }

    static async fetchOne(req, res, next) {
        try {
            const persons = await Persons.findOne({id: req.params.id});
            res.send(persons);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const result = await Persons.insertOne(req.body);
            res.send({
                success:true,
                result
            });
        } catch (error) {
            next(error);
        }
    }

    static async save(req, res, next) {
        try {
            const result = await Persons.updateOne({id: req.params.id}, req.body);
            res.send(result);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const result = await Persons.deleteOne(req.params.id);
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CountryController;
