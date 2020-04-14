// migration or seed only
require('dotenv').config();

const path = require('path');
const {
    DB_DRIVER,
    DB_CONFIG
} = process.env;

const basePath = `${path.normalize(`${__dirname}`)}`;

module.exports = {
    client: DB_DRIVER,
    connection: JSON.parse(DB_CONFIG),
    pool: {
        min: 0,
        max: 20
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: `${basePath}/db/migrations`
    },
    seeds: {directory: `${basePath}/db/seeds`}
};
