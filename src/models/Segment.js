const createModel = include('helpers/modelCreate');

const name = 'Segment';
const tableName = 'segment';

const selectableProps = [
    'id',
    'stateId',
    'department',
    'fraction',
    'radius',
    'segment',
    'type',
    'data',
    'deleted',
    'createdAt',
    'updatedAt',
    'deletedAt',
    '__v'
];

class SegmentModel extends createModel {
    constructor(props) {
        super({
            ...props,
            name,
            tableName,
            selectableProps
        });
    }

    getDistinctDepartmentsByFilter(filters) {
        const query = this.knex(this.tableName).distinct('stateId', 'department')
            .innerJoin('assignment as as', 'as.segment', `${this.tableName}.id`)
            .where(filters);
        return query.orderBy(['stateId', 'department']).timeout(this.timeout);
    }

    getDistinctFractionByFilter(filters) {
        const query = this.knex(this.tableName).distinct('stateId', 'department', 'fraction')
            .innerJoin('assignment as as', 'as.segment', `${this.tableName}.id`)
            .where(filters);
        return query.orderBy(['stateId', 'department', 'fraction']).timeout(this.timeout);
    }

    getDistinctRadiusByFilter(filters) {
        const query = this.knex(this.tableName).distinct('stateId', 'department', 'fraction', 'radius')
            .innerJoin('assignment as as', 'as.segment', `${this.tableName}.id`)
            .where(filters);
        return query.orderBy(['stateId', 'department', 'fraction', 'radius']).timeout(this.timeout);
    }

    getDistinctSegmentsByFilter(filters) {
        const query = this.knex(this.tableName).distinct('stateId', 'department', 'fraction', 'radius', `${this.tableName}.segment`)
            .innerJoin('assignment as as', 'as.segment', `${this.tableName}.id`)
            .where(filters);
        return query.orderBy(['stateId', 'department', 'fraction', 'radius', 'segment']).timeout(this.timeout);
    }
}

module.exports = knex => new SegmentModel({knex});
