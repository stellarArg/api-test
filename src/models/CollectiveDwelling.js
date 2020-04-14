const {PAGE_SIZE} = process.env;
const createModel = include('helpers/modelCreate');

const name = 'CollectiveDwelling';
const tableName = 'collectiveDwelling';

const selectableProps = [
    'id',
    'segment',
    'label',
    'data',
    'deleted',
    'createdAt',
    'updatedAt',
    'deletedAt',
    '__v'
];

const toNumber = require('lodash/toNumber');
const map = require('lodash/map');
const toLower = require('lodash/toLower');

class CollectiveDwellingsModel extends createModel {
    constructor(props) {
        super({
            ...props,
            name,
            tableName,
            selectableProps
        });
    }

    fetchDwellings(filters, columns = selectableProps) {
        const {
            managementFraction,
            term,
            assignment,
            stateId,
            department,
            fraction,
            radius,
            collectiveType,
            skip
        } = filters;

        if (filters.segment) {
            filters['seg.segment'] = filters.segment;
            delete filters.segment;
        }

        const finalProps = map(columns, column =>
            `${this.tableName}.${column}`
        );

        const query = this.knex(this.tableName)
            .select([...finalProps, 'seg.stateId', 'seg.department', 'seg.radius', 'seg.fraction', 'seg.segment', 'seg.id as segmentId',
                this.knex.raw('CASE WHEN jsonb_array_length(ca.pollster) = 0 THEN false else true end as assignment')])
            .from(this.tableName)
            .innerJoin('assignment as asg', 'asg.segment', `${this.tableName}.segment`)
            .innerJoin('segment as seg', 'seg.id', `${this.tableName}.segment`)
            .innerJoin('collectiveAssignment as ca', 'ca.collectiveDwelling', `${this.tableName}.id`)
            .where({
                stateId,
                fraction,
                department,
                managementFraction,
                'seg.segment': 90
            });

        if (term) {
            query.andWhere(function() {
                this.whereRaw('LOWER(label::varchar) like ?', `%${toLower(term)}%`)
                    .orWhereRaw('"collectiveDwelling".data->>\'streetName\' like ?', `%${term}%`);
            });
        }

        if(assignment === 'on'){
            query.andWhereRaw('jsonb_array_length(ca.pollster) > ?', [0]);
        }
        if(assignment === 'off'){
            query.andWhereRaw('jsonb_array_length(ca.pollster) = ?', [0]);
        }

        if(radius){
            query.andWhere({radius});
        }

        if(collectiveType){
            query.andWhereRaw('"collectiveDwelling".data->>\'type\' = ?', [collectiveType]);
        }

        return query.limit(PAGE_SIZE).offset(toNumber(skip) * PAGE_SIZE).orderBy('updatedAt').timeout(this.timeout);
    }

    canDeleteDwelling(filters){

        const query = this.knex.select('ca.id',
            this.knex.raw('CASE WHEN jsonb_array_length(ca.pollster) = 0 THEN false else true end as assignment FROM segment as seg'))
            .innerJoin('assignment as asg', 'asg.segment', 'seg.id')
            .innerJoin('collectiveDwelling as cd', 'cd.segment', 'seg.id')
            .innerJoin('collectiveAssignment as ca', 'ca.collectiveDwelling', 'cd.id')
            .where(filters)
            .andWhere('seg.segment', 90);
        return query.timeout(this.timeout);
    }
}

module.exports = knex => new CollectiveDwellingsModel({knex});
