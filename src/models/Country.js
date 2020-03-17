const toNumber = require('lodash/toNumber');
const {PAGE_SIZE} = process.env;
const createModel = include('helpers/modelCreate');

const name = 'Country';
const tableName = 'country';

const selectableProps = [
    'name',
    'code',
    'iso2',
    'createdAt',
    'updatedAt',
    'deletedAt',
    '__v'
];

class CountryModel extends createModel {
    constructor(props) {
        super({
            ...props,
            name,
            tableName,
            selectableProps
        });
    }
}

module.exports = knex => new CountryModel({knex});
