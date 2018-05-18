import mongoose from 'mongoose';
import {every, concat} from 'lodash';
import {services} from '@indec/heimdall';

import pkg from '../../package';

/**
 * Creates the status object
 * @param {Array<{status}>} deps Required dependencies to work.
 * @param {Array<{status}>} optionalDeps Optional dependencies to work.
 * @returns {{name, status: string, deps}} Returns the status of this app.
 */
const generateStatus = (deps, optionalDeps = []) => ({
    name: pkg.name,
    status: every(deps, ({status: 'ok'}))
        ? every(optionalDeps, ({status: 'ok'})) ? 'ok' : 'degraded'
        : 'down',
    deps: concat(deps, optionalDeps)
});

export default class StatusService {
    static getStatus() {
        return generateStatus([StatusService.getMongoDBStatus()]);
    }

    static getHealth() {
        return StatusService.getHeimdallStatus().then(
            heimdallStatus => generateStatus([StatusService.getMongoDBStatus()], [heimdallStatus])
        );
    }

    static getHeimdallStatus() {
        return services.StatusService.fetchReady();
    }

    static getMongoDBStatus() {
        const connected = mongoose.connection.readyState === 1;
        return {name: 'MongoDB', status: connected ? 'ok' : 'down'};
    }
}
