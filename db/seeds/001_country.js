require('../../src/global');

const {Persons} = include('/models');
const persons = require('./persons.json');

exports.seed = async knex => {
    await knex(Persons.tableName).del();
    try {
        await Persons.startTransaction();
        // eslint-disable-next-line lodash/prefer-lodash-method
        await Promise.all(persons.map(person => Persons.insertOne(person))) ;
        return Persons.commitTransaction();
    } catch(err) {
        console.log('err: ', err);
    }
};
