const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const sumBy = require('lodash/sumBy');

const createModel = include('helpers/modelCreate');

const name = 'CollectiveFieldData';
const tableName = 'collectiveFieldData';

const selectableProps = [
    'id',
    'collectiveDwelling',
    'visited',
    'uninhabited',
    'absent',
    'total',
    'expected',
    'dwellingMissingVisit',
    'womans',
    'mans',
    'totalPopulation',
    'turn',
    'deleted',
    'createdAt',
    'updatedAt',
    'deletedAt',
    '__v'
];

class CollectiveFieldDataModel extends createModel {
    constructor(props) {
        super({
            ...props,
            name,
            tableName,
            selectableProps
        });
    }

    async getFieldDataByUser(filters) {
        const query = this.knex.select(
            `${this.tableName}.id`,
            'visited', 'uninhabited', 'absent', 'womans', 'mans',
            'turn', 'seg.radius', 'cas.pollster',
            'seg.data').from(this.tableName)
            .innerJoin('assignment as as', 'as.segment', `${this.tableName}.segment`)
            .innerJoin('segment as seg', 'seg.id', `${this.tableName}.segment`)
            .innerJoin('collectiveDwelling as cd', 'cd.segment', `${this.tableName}.segment`)
            .innerJoin('collectiveAssignment as cas', 'cd.id', 'cas.collectiveDwelling')
            .where(filters);

        const result = await query.orderBy(['fraction', 'radius', 'seg.segment']).timeout(this.timeout);

        return map(result, r => ({
            ...r,
            disabled: isEmpty(r.pollster),
            expectedDwellings: sumBy(r.data, data => data.expectedDwellings)
        }));
    }

    async getReports(filters, column) {
        const result = await this.knex.select(
            `${column}`,
            this.knex.raw('sum(visited) as visited'),
            this.knex.raw('sum(womans) as womans'),
            this.knex.raw('sum(mans) as mans'),
            'seg.data'
        )
            .from(this.tableName)
            .innerJoin('assignment as as', 'as.segment', `${this.tableName}.segment`)
            .innerJoin('segment as seg', 'seg.id', `${this.tableName}.segment`)
            .where(filters).groupBy([column, 'seg.data']).orderBy([column]).timeout(this.timeout);

        return map(result, r => ({
            ...r,
            disabled: isEmpty(r.pollster),
            expectedDwellings: sumBy(r.data, data => data.expectedDwellings)
        }));
    }
}

module.exports = knex => new CollectiveFieldDataModel({knex});
