const ModelCreate = include('helpers/modelCreate');

const tableName = 'persons';
const name = 'Persons';
const selectableProps = [
    'id',
    'name',
    'surname',
    'email',
    'gender',
    'avatar',
    'deleted'
];

class Persons extends ModelCreate {
    constructor(props) {
        super({
            ...props,
            tableName,
            name,
            selectableProps
        });
    }
}

module.exports = knex => new Persons({knex});
