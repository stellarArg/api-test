const knex = require('knex');
let mockKnex;
try {
    mockKnex = require('mock-knex');
// eslint-disable-next-line no-empty
} catch (err) {}
const path = require('path');
const {
    DB_DRIVER,
    DB_CONFIG,
    NODE_ENV
} = process.env;
const basePath = `${path.normalize(`${__dirname}/../..`)}`;

const Logger = require(`${basePath}/src/helpers/logger`);

let db;
if (DB_CONFIG && DB_DRIVER) {
    if (NODE_ENV === 'test') {
        db = knex({
            client: DB_DRIVER,
            debug: false
        });
        mockKnex.mock(db, 'knex@0.20');
    } else {
        db = knex({
            client: DB_DRIVER,
            connection: JSON.parse(DB_CONFIG),
            pool: {
                min: 0,
                max: 100
            },
            migrations: {
                tableName: 'knex_migrations',
                directory: `${basePath}/db/migrations`
            },
            seeds: {directory: `${basePath}/db/seeds`}
        });
        db.raw('SELECT \'test connection\';').then(() => {
            process.env.database = 'ok';
            return Logger.info('database connected...');
        }).catch(() => {
            process.env.database = 'down';
            Logger.error('database connection failed...');
        });
    }
}
module.exports = db;
