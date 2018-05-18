import {
    mapKeys,
    concat,
    forEach,
    toString,
    reduce,
    orderBy,
    assign,
    includes
} from 'lodash';
import {Types} from 'mongoose';

import {
    SurveyAddressService,
    PermissionService,
    UsersService
} from '../services';
import enums from '../common/enums';

const {ObjectId} = Types;
const {roles} = enums;

const reduceMe = objToReduce => reduce(objToReduce, function (result, value) {
    result[value._id] = value;
    return result;
}, {});

export default class PollstersController {
    static getPollstersByState(req, res, next) {
        const {filters} = PermissionService.getReviewAggregation(req.user, req.params.stateId);
        mapKeys(filters, (value, key) => {
            filters[`addressInfo.${key}`] = value;
            delete filters[key];
        });
        const UserService = UsersService.getUserService();
        return Promise.all([
            SurveyAddressService.getPollstersMonitoring(filters),
            UserService.search({rol: roles.POLLSTER, state: filters['addressInfo.stateId']}),
            UserService.search({rol: roles.RECUPERATOR, state: filters['addressInfo.stateId']})
        ]).then(([pollsters, heimPollsters, heimSupervisors]) => {
            const users = reduceMe(concat(heimPollsters, heimSupervisors));
            /* eslint lodash/collection-method-value: 0 */
            const p = orderBy(
                forEach(pollsters, pollster => {
                    const u = users[toString(pollster._id)];
                    pollster._id = {};

                    assign(pollster._id, {
                        pollsterName: u ? `${u.surname}, ${u.name}` : 'N/A',
                        id: u._id,
                        stateId: u.state,
                        rol: includes(u.roles, roles.RECUPERATOR) ?
                            'Supervisor/Recuperador' : 'Encuestador'
                    });
                }), ['_id.pollsterName'], [1]);
            return res.send({pollsters: p});
        }).catch(next);
    }

    static getPollsterByDate(req, res, next) {
        const {filters} = PermissionService.getReviewAggregation(req.user);
        filters.pollster = ObjectId(req.params.id);
        mapKeys(filters, (value, key) => {
            filters[`addressInfo.${key}`] = value;
            delete filters[key];
        });

        return SurveyAddressService.getPollsterByDate(filters).then(pollster => UsersService.fetchOne(req.params.id).then(user => {
            const name = user ? `${user.surname}, ${user.name}` : 'N/A';
            return res.send({pollster: {name, dates: pollster}});
        })).catch(next);
    }
}
