require('../../src/global');

const {Country} = include('/models');
const countries = require('./countries.json');
exports.seed = async knex => {
    await knex(Country.tableName).del();
    try {
        // eslint-disable-next-line lodash/prefer-lodash-method
        return await Promise.all(countries.map(country => Country.insertOne(country))) ;
    } catch(err) {
        console.log('err: ', err);
    }
};
