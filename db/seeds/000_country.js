require('../../src/global');

const {Country} = include('/models');
const countries = require('./countries.json');

exports.seed = async knex => {
    await knex(Country.tableName).del();
    try {
        await Country.startTransaction();
        // eslint-disable-next-line lodash/prefer-lodash-method
        await Promise.all(countries.map(country => Country.insertOne(country))) ;
        return Country.commitTransaction();
    } catch(err) {
        console.log('err: ', err);
    }
};
