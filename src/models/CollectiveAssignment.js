const createModel = include('helpers/modelCreate');

const name = 'CollectiveAssignment';
const tableName = 'collectiveAssignment';

const selectableProps = [
    'id',
    'collectiveDwelling',
    'pollster',
    'deleted',
    'createdAt',
    'updatedAt',
    'deletedAt',
    '__v'
];

class CollectiveAssignmentModel extends createModel {
    constructor(props) {
        super({
            ...props,
            name,
            tableName,
            selectableProps
        });
    }

    fetchAssignments(columns, filters) {
        const query = this.knex(this.tableName)
            .column(columns)
            .distinct()
            .innerJoin('collectiveDwellings dw', 'dw.id', `${this.tableName}.collectiveDwelling`)
            .innerJoin('assignment asg', 'asg.segment', 'dw.segment')
            .innerJoin('segment as seg', 'seg.id', 'dw.segment')
            .where(filters)
            .andWhere(`${this.tableName}.deleted`, false)
            .andWhere('seg.segment', 90);

        return query.orderBy(columns).timeout(this.timeout);
    }
}

module.exports = knex => new CollectiveAssignmentModel({knex});
