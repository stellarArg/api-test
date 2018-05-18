import fs from 'fs';
import winston from 'winston';
import {Router} from 'express';
import {forEach, reject, replace} from 'lodash';

const importModule = file => require(`./${file}`).default;

const loadModules = (folder, router) => {
    // Loading modules dynamically
    forEach(
        reject(
            fs.readdirSync(folder),
            file => file === 'index.js'
        ),
        file => {
            const module = replace(file, '.js', '');
            winston.info('Loading %s api...', module);
            router.use(`/${module}`,importModule(file)(Router()));
        }
    );
};

export default router => {
    loadModules('./src/routes/api', router);
    return router;
};
