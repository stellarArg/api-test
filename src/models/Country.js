const ModelCreate = include('helpers/modelCreate');

const tableName = 'country';
const name = 'Country';
const selectableProps = [
    'id',
    'name',
    'iso2',
    'code',
    'deleted'
];

class Country extends ModelCreate {
    constructor(props) {
        super({
            ...props,
            tableName,
            name,
            selectableProps
        });
    }
}

module.exports = knex => new Country({knex});
