import {SyncLog} from '../model';
import {DemoSurvey, SurveyAddressService} from '../services';
import {filter, cloneDeep} from 'lodash';

export default class SyncController {
    static isDemoUser(req, res, next) {
        if (!req.user.isDemo) {
            return next();
        }
        return DemoSurvey.fetch().then(
            surveyAddresses => res.send({surveyAddresses})
        ).catch(next);
    }

    static filterIncorrectSurveys(req, res, next) {
        req.body.surveys = filter(req.body.surveys, s => !!s._id);
        next();
    }

    static saveStagingSurvey(req, res, next) {
        const surveys = cloneDeep(req.body.surveys);
        if (!surveys || !surveys.length) {
            return next();
        }
        return SurveyAddressService.saveStagingSurveys(surveys, req.syncLog, req.user).then(
            () => next()
        ).catch(next);
    }

    static saveSurveyAddress(req, res, next) {
        const syncLog = new SyncLog({
            user: req.user._id,
            received: 0,
            edited: 0,
            visited: 0,
            closed: 0,
            sent: 0,
            created: 0
        });
        const surveys = req.body.surveys;
        if (!surveys || !surveys.length) {
            return next();
        }
        syncLog.received = surveys.length;
        return SurveyAddressService.saveSurveys(surveys, syncLog, req.user).then(
            () => next()
        ).catch(next);
    }

    static syncSurveyAddress(req, res, next) {
        return SurveyAddressService.fetchSync(req.user._id).then(
            surveyAddresses => res.send({surveyAddresses, lastSync: new Date()})
        ).catch(next);
    }
}
