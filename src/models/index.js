const fs = require('fs');
const path = require('path');
const knex = include('helpers/database');

const filter = require('lodash/filter');
const map = require('lodash/map');
const reduce = require('lodash/reduce');
const startsWith = require('lodash/startsWith');
const endsWith = require('lodash/endsWith');
const includes = require('lodash/includes');

const getModelFiles = dir => map(
    filter(fs.readdirSync(dir), file => !startsWith(file, '.') && endsWith(file, '.js') && file !== 'index.js')
    , file => path.join(dir, file)
);

// Gather up all model files (i.e., any file present in the current directory
// that is not this file) and export them as properties of an object such that
// they may be imported using destructuring like
// `const { MyModel } = require('./models')` where there is a model named
// `MyModel` present in the exported object of gathered models.
const files = getModelFiles(__dirname);

const models = reduce(files, (modelsObj, filename) => {
    if (!includes(filename, 'index.js')) {
        const model = require(filename)(knex);
        if (model) {
            modelsObj[model.name] = model;
        }
    }
    return modelsObj;
}, {});

module.exports = models;
