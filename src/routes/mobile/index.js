import winston from 'winston';
import {Router} from 'express';
import {forEach} from 'lodash';
import requireDir from 'require-dir';

export default router => {
    forEach(
        requireDir('.'),
        (module, name) => {
            winston.info('Loading %s api...', name);
            router.use(`/${name}`, module.default(Router()));
        }
    );
    return router;
};
