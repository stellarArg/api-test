const isEmpty = require('lodash/isEmpty');
const assign = require('lodash/assign');
const get = require('lodash/get');
const map = require('lodash/map');
const reduce = require('lodash/reduce');
const replace = require('lodash/replace');
const sortBy = require('lodash/sortBy');
const sumBy = require('lodash/sumBy');
const toNumber = require('lodash/toNumber');
const values = require('lodash/values');

const createModel = include('helpers/modelCreate');

const name = 'FieldData';
const tableName = 'fieldData';

const selectableProps = [
    'id',
    'segment',
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

class FieldDataModel extends createModel {
    constructor(props) {
        super({
            ...props,
            name,
            tableName,
            selectableProps
        });
    }

    async getFieldDataByUser(filters) {
        const result = await this.knex.select(
            `${this.tableName}.id`,
            'visited', 'uninhabited', 'absent', 'womans', 'mans',
            'turn', 'seg.segment as segment', 'as.pollster',
            'seg.data').from(this.tableName)
            .innerJoin('assignment as as', 'as.segment', `${this.tableName}.segment`)
            .innerJoin('segment as seg', 'seg.id', `${this.tableName}.segment`)
            .where(filters).orderBy(['fraction', 'radius', 'seg.segment']).timeout(this.timeout);

        return map(result, r => ({
            ...r,
            disabled: isEmpty(r.pollster),
            expectedDwellings: sumBy(r.data, data => data.expectedDwellings)
        }));
    }

    async getReports(filters, operative, column) {
        const query = this.knex.select(
            `${column}`,
            this.knex.raw('sum(visited) as visited'),
            this.knex.raw('sum(uninhabited) as uninhabited'),
            this.knex.raw('sum(absent) as absent'),
            this.knex.raw('sum(womans) as womans'),
            this.knex.raw('sum(mans) as mans'),
            'seg.data'
        )
            .from(this.tableName)
            .innerJoin('assignment as as', 'as.segment', `${this.tableName}.segment`)
            .innerJoin('segment as seg', 'seg.id', `${this.tableName}.segment`)
            .where(filters);

        if (operative === 'rural') {
            query.andWhere(function() {
                this.where('seg.type', 'r').orWhere(
                    function() {
                        this.whereRaw('seg.segment::integer between ? and ?', [1, 69]).andWhere('seg.type', 'm');
                    });
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

        const result = map(await query
            .groupBy(column)
            .groupBy('seg.data')
            .orderBy(column)
            .timeout(this.timeout), r => {
            const {data} = r;
            delete r.data;
            return {
                ...r,
                expectedDwellings: sumBy(data, d => d.expectedDwellings)
            };
        });

        const results = values(reduce(result, (grouped, data) => {
            const obj = data[replace(column, 'seg.', '')];
            const {
                visited,
                uninhabited,
                absent,
                womans,
                mans,
                expectedDwellings
            } = data;

            if (grouped[obj]) {
                assign(
                    grouped[obj],
                    {
                        level: column,
                        value: obj,
                        visited: get(grouped[obj], 'visited') + toNumber(visited),
                        uninhabited: get(grouped[obj], 'uninhabited') + toNumber(uninhabited),
                        absent: get(grouped[obj], 'absent') + toNumber(absent),
                        womans: get(grouped[obj], 'womans') + toNumber(womans),
                        mans: get(grouped[obj], 'mans') + toNumber(mans),
                        expectedDwellings: get(grouped[obj], 'expectedDwellings') + toNumber(expectedDwellings)
                    }
                );
            } else {
                assign(
                    grouped,
                    {
                        [obj]: {
                            level: column,
                            value: obj,
                            visited: toNumber(visited),
                            uninhabited: toNumber(uninhabited),
                            absent: toNumber(absent),
                            womans: toNumber(womans),
                            mans: toNumber(mans),
                            expectedDwellings: toNumber(expectedDwellings)
                        }
                    }
                );
            }

            return grouped;
        }, {}));

        return sortBy(results, a => toNumber(a.value));
    }

    getFieldDataWithoutAdvance(filters, level, stateFilters, turn, operative) {
        const query = this.knex.with('a', qb => {
            qb.select(
                'asg.segment',
                turn === 'noon' ?
                    this.knex.raw('sum(case when visited = 0 and uninhabited = 0 then 1 else 0 end) as amount')
                    : this.knex.raw('sum(case when visited = 0 and uninhabited = 0 and absent = 0 then 1 else 0 end) as amount')
            ).from(this.tableName)
                .innerJoin('assignment as asg', 'asg.segment', `${this.tableName}.segment`)
                .where(filters)
                .andWhere({turn})
                .groupBy('asg.segment');
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
                .innerJoin('a', 'a.segment', 's.id');

            if (operative === 'rural') {
                qb.andWhere(function() {
                    this.where('s.type', 'r').orWhere(
                        function() {
                            this.whereRaw('s.segment::integer between ? and ?', [1, 69]).andWhere('s.type', 'm');
                        });
                });
            } else if (operative === 'particular') {
                qb.andWhere(function() {
                    this.where('s.type', 'u').orWhere(
                        function() {
                            this.whereRaw('s.segment::integer between ? and ?', [70, 89]).andWhere('s.type', 'm');
                        }
                    );
                });
            }

            qb.groupBy('stateId')
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

        if (!level) {
            return query.select().from('s4').orderBy('value').timeout(this.timeout);
        }

        if (level === 'stateId') {
            return query.select().from('s3').where(stateFilters).orderBy('value').timeout(this.timeout);
        }

        if (level === 'department') {
            return query.select().from('s2').where(stateFilters).orderBy('value').timeout(this.timeout);
        }

        if (level === 'fraction') {
            return query.select().from('s').where(stateFilters).orderBy('value').timeout(this.timeout);
        }

        return query.select(
            'a.*',
            'seg.segment as value',
            this.knex.raw('\'seg.segment\' as level'),
            this.knex.raw('case when amount = 1 then 0 else 1 end as segments')
        ).from('a')
            .innerJoin('segment as seg', 'a.segment', 'seg.id')
            .where(stateFilters).orderBy('value')
            .timeout(this.timeout);
    }
}

module.exports = knex => new FieldDataModel({knex});
