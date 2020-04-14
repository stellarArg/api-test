const pick = require('lodash/pick');

const createModel = include('helpers/modelCreate');

const name = 'Assignment';
const tableName = 'assignment';

const selectableProps = [
    'id',
    'segment',
    'nationalCoordinator',
    'coordinator',
    'managementCoordinator',
    'managementDepartment',
    'managementFraction',
    'fractionAssistant',
    'managementRadius',
    'pollster',
    'type',
    'modifier',
    'radiusOpen',
    'deleted',
    'createdAt',
    'updatedAt',
    'deletedAt',
    '__v'
];

class AssignmentModel extends createModel {
    constructor(props) {
        super({
            ...props,
            name,
            tableName,
            selectableProps
        });
    }

    fetchAssignments(columns, filters, operative) {
        const query = this.knex(this.tableName)
            .column(columns)
            .distinct()
            .innerJoin('segment as seg', 'seg.id', `${this.tableName}.segment`);
        if (operative === 'collectives') {
            columns.push('cd.data->>\'type\'');
        }
        query.where(filters)
            .andWhere(`${this.tableName}.deleted`, false);

        if (operative === 'rural') {
            query.andWhere(function() {
                this.where('seg.type', 'r').orWhere(
                    function() {
                        this.whereRaw('seg.segment::integer between ? and ?', [1, 69]).andWhere('seg.type', 'm');
                    });
            });
        } else if (operative === 'collectives') {
            query.andWhere(function() {
                this.where('seg.segment', '90');
            });
        } else if (operative === 'particular') {
            query.andWhere(function() {
                this.where('seg.type', 'u').orWhere(
                    function() {
                        this.whereRaw('seg.segment::integer between ? and ?', [70, 89]).andWhere('seg.type', 'm');
                    }
                );
            });
        }
        query.orderBy(columns).timeout(this.timeout);
        console.log(query.toString());
        return query;
    }

    updateByFilters(filters, values) {
        if (filters.id) {
            return this.knex(this.tableName).update(values).where({id: filters.id});
        } else {
            return this.knex(this.tableName).update(values).whereIn('segment', function () {
                this.select('id').from('segment').where(filters);
            });
        }

    }

    getNullsAssignments(filters, level, stateFilters) {
        const query = this.knex.with('a', qb => {
            qb.select(
                'segment',
                this.knex.raw('sum(case when pollster is null then 1 else 0 end) as amount')
            ).from(this.tableName)
                .where(filters)
                .groupBy('segment');
        }).with('s', qb => {
            qb.select(
                'stateId',
                'department',
                'fraction',
                'radius as value',
                this.knex.raw('\'radius\' as level'),
                this.knex.raw('count(1) as segments'),
                this.knex.raw('sum(amount) as amount')
            ).from('segment as s')
                .innerJoin('a', 'a.segment', 's.id')
                .groupBy('stateId')
                .groupBy('department')
                .groupBy('fraction')
                .groupBy('radius');
        }).with('s2', qb => {
            qb.select(
                'stateId',
                'department',
                'fraction as value',
                this.knex.raw('\'fraction\' as level'),
                this.knex.raw('count(1) as radius'),
                this.knex.raw('sum(segments) as segments'),
                this.knex.raw('sum(amount) as amount')
            ).from('s')
                .groupBy('stateId')
                .groupBy('department')
                .groupBy('fraction');
        }).with('s3', qb => {
            qb.select(
                'stateId',
                'department as value',
                this.knex.raw('\'department\' as level'),
                this.knex.raw('count(1) as fraction'),
                this.knex.raw('sum(radius) as radius'),
                this.knex.raw('sum(segments) as segments'),
                this.knex.raw('sum(amount) as amount')
            ).from('s2')
                .groupBy('stateId')
                .groupBy('department');
        }).with('s4', qb => {
            qb.select(
                'stateId as value',
                this.knex.raw('\'stateId\' as level'),
                this.knex.raw('count(1) as department'),
                this.knex.raw('sum(fraction) as fraction'),
                this.knex.raw('sum(radius) as radius'),
                this.knex.raw('sum(segments) as segments'),
                this.knex.raw('sum(amount) as amount')
            ).from('s3')
                .groupBy('stateId');
        });

        if (level === 'stateId') {
            return query.select().from('s4').timeout(this.timeout);
        }

        if (level === 'department') {
            return query.select().from('s3').where(stateFilters).timeout(this.timeout);
        }

        if (level === 'fraction') {
            return query.select().from('s2').where(stateFilters).timeout(this.timeout);
        }

        if (level === 'radius') {
            return query.select().from('s').where(stateFilters).timeout(this.timeout);
        }

        return query.select(
            'a.*',
            'seg.segment as value',
            this.knex.raw('\'seg.segment\' as level'),
            this.knex.raw('case when amount = 1 then 0 else 1 end as segments')
        ).from('a').innerJoin('segment as seg', 'a.segment', 'seg.id').where(stateFilters).timeout(this.timeout);
    }

    async openOrClose(filters, status, modifier) {
        try {
            const segmentFilters = pick(filters, ['stateId', 'department', 'fraction', 'radius']);
            delete filters.stateId;
            delete filters.department;
            delete filters.fraction;
            delete filters.radius;

            const query = this.knex
                .update({
                    radiusOpen: status,
                    modifier
                })
                .from(this.tableName)
                .where(filters)
                .andWhere(function() {
                    this.whereIn('segment', function() {
                        this.select('id').from('segment')
                            .where(segmentFilters);
                    });
                });
            await query.timeout(this.timeout);
            return true;
        } catch(err) {
            throw Error(err);
        }
    }
}

module.exports = knex => new AssignmentModel({knex});
