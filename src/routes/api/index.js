const {Router} = require('express');
const requireDir = require('require-dir');
const forEach = require('lodash/forEach');

const logger = include('helpers/logger');

module.exports = router => {
    forEach(
        requireDir('.', {recurse: true}),
        (module, name) => {
            if (process.env.NODE_ENV !== 'test') {
                logger.info(`Loading ${name} api...`);
            }
            router.use(`/${name}`, module(Router()));
        }
    );
    return router;
};
