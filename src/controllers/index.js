const fs = require('fs');
const upperFirst = require('lodash/upperFirst');
const includes = require('lodash/includes');
const reduce = require('lodash/reduce');

const models = reduce(fs.readdirSync(__dirname), (modelsObj, filename) => {
    if (!includes(filename, 'index.js')) {
        // eslint-disable-next-line lodash/prefer-lodash-method
        modelsObj[`${upperFirst(filename.replace('.js', ''))}Controller`] = include(`controllers/${filename}`);
    }
    return modelsObj;
}, {});

module.exports = models;
