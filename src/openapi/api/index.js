const fs = require('fs');
const assign = require('lodash/assign');
const includes = require('lodash/includes');
const reduce = require('lodash/reduce');

const apis = reduce(fs.readdirSync(__dirname), (apisObj, filename) => {
    if (!includes(filename, 'index.js')) {
        // eslint-disable-next-line lodash/prefer-lodash-method
        assign(apisObj, require(`./${filename}`));
    }
    return apisObj;
}, {});

module.exports = apis;
