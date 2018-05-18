import winston from 'winston';
import {isFunction} from 'lodash';

import cache from '../../helpers/cache';

const {REDIS_PREFIX, REDIS_TTL} = process.env;

let redis = null;

if (!cache) {
    winston.info('[Redis] Cache is disabled.');
    redis = () => (req, res, next) => {
        res.sendCacheable = res.send;
        next();
    };
} else {

    winston.info('[Redis] Cache is enabled.');
    redis = (opts = {}) => (req, res, next) => {
        let key = REDIS_PREFIX + req.originalUrl;
        if (isFunction(opts.varyBy)) {
            key += `:${opts.varyBy(req)}`;
        }
        cache.get(key, (err, value) => {
            if (err) {
                winston.error('[REDIS-Error]', err);
                return next();
            }
            if (value) {
                winston.info('[cache] HIT %s', key);
                res.send(JSON.parse(value));
                return;
            }
            winston.info('[cache] MISS %s', key);
            res.sendCacheable = value => {
                res.send(value);
                cache.set(key, JSON.stringify(value));
                cache.expire(key, opts.ttl || REDIS_TTL);
            };
            next();
        });
    };
}

export default redis;
