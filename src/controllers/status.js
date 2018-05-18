import {StatusService} from '../services';
import PKG from '../../package';

export default class StatusController {
    static ping(req, res, next) {
        try {
            res.send({version: PKG.version});
        } catch (err) {
            next(err);
        }
    }

    static getStatus(req, res, next) {
        try {
            res.send(StatusService.getStatus());
        } catch (err) {
            next(err);
        }
    }

    static getHealth(req, res, next) {
        StatusService.getHealth().then(
            status => res.send(status)
        ).catch(next);
    }
}
