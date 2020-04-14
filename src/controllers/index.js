const fs = require('fs');
const upperFirst = require('lodash/upperFirst');
const includes = require('lodash/includes');
const reduce = require('lodash/reduce');

const models = reduce(fs.readdirSync(), (modelsObj, filename) => {
    if (!includes(filename, 'index.js')) {
        modelsObj[`${upperFirst(filename)}Controller`] = include(filename);
    }
    return modelsObj;
}, {});

module.exports = models;
