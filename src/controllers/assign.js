import {
    includes,
    flatMap,
    forEach,
    filter,
    keys,
    map,
    isEmpty,
    join,
    toString
} from 'lodash';

import {
    PermissionService,
    AddressService,
    UsersService,
    SurveyAddressService,
    LogService
} from '../services';

const DONE = true;

export default class AssignController {
    static getGeographic(req, res, next) {
        const {filters, aggregate} = PermissionService.getAddressPermision(req.user);
        return Promise.all([AddressService.getRegionalAggregation(filters, aggregate), UsersService.users(req)]).then(
            ([address, users]) => {
                const regionalAddress = flatMap(address, e => e._id);
                return res.send({regionalAddress, users});
            }
        ).catch(next);
    }

    static saveAssign(req, res, next) {
        const saveData = filter(req.body, e => e.modified);
        const assignParams = PermissionService.getAddressParams(req.user);
        forEach(saveData, save => {
            forEach(keys(assignParams.query), field => {
                if(includes(assignParams.fields, field)) {
                    assignParams.query[field] = save.geographic[field];
                }
            });
            const update = {
                $set: {
                    [assignParams.role]: save.taken
                }
            };
            AddressService.saveRegionalAssign(assignParams.query, update).catch(next);
            if(assignParams.role === 'pollster') {
                SurveyAddressService.create({address: save.geographic._id}, save.taken);
            }
        });
        return res.send({success: true});
    }

    static getDynamicAssign(req, res, next) {
        const {group, filters, stateId} = PermissionService.getDynamicAssignFilter(req.user, req.query);
        return Promise.all([
            AddressService.getRegionalAggregation(filters, group),
            UsersService.UsersToAssign(req.user, stateId)
        ]).then(([addresses, users]) => {
            const regionalInfo = map(addresses, address => {
                const data = address._id;
                data.total = address.count;
                return data;
            });
            return res.send({regionalInfo, users});
        }).catch(next);
    }

    /**
     * caso _id, es assignación o reasignación de una casa
     * caso segmento, area, ups, es assignación o reasignación de un área
     * Para el caso de ups solo es caso de subCoordinador unicamente
     */
    static saveDynamicAssign(req, res, next) {
        return Promise.all(map(req.body, assignAddress => {
            const {
                update,
                pollsterReasign,
                filters
            } = PermissionService.getDynamicAssignSaveFilter(req.user, assignAddress);
            if(update.pollster && !filters.pollster) {
                filters.pollster = null;
            }
            if(update.supervisor && !filters.supervisor) {
                filters.supervisor = null;
            }

            if(!isEmpty(update)) {
                return LogService.log(
                    req.user._id,
                    'update',
                    'addresses', {update, filters},
                    `Update perform on addresses by the user ${req.user.surname}, ${req.user.username} rol/es: ${join(req.user.roles, ', ')}`
                ).then(() => AddressService.saveRegionalAssign(filters, update).then(
                    () => {
                        if(pollsterReasign) {
                            LogService.log(
                                req.user._id,
                                'update/insert',
                                'surveyAddresses', {update, filters},
                                `Update perform on surveyAddresses by the user ${req.user.surname}, ` +
                                `${req.user.username} rol/es: ${join(req.user.roles, ', ')}`
                            ).then(() => DONE).catch(() => DONE);
                        }
                        if(update.pollster) {
                            filters.pollster = update.pollster;
                        }
                        if(update.supervisor) {
                            filters.supervisor = update.supervisor;
                        }
                        if(update.subCoordinator) {
                            filters.subCoordinator = update.subCoordinator;
                        }
                        return AddressService.fetch(filters).then(addressses => map(addressses,
                            a => {
                                const pollster = a.pollster ? toString(a.pollster) :
                                    null;
                                if(pollster) {
                                    return SurveyAddressService.create({address: a._id}, {
                                        addressInfo: {
                                            stateId: a.stateId,
                                            ups: a.ups,
                                            area: a.area,
                                            supervisor: a.supervisor || null,
                                            pollster: a.pollster || null,
                                            subCoordinator: a.subCoordinator ||
                                                null
                                        },
                                        pollster
                                    }).then(() => DONE);
                                }
                                return DONE;
                            })).catch(err => next(err));
                    }
                ).catch(err => next(err))).catch(next);
            }
            return assignAddress;
        })).then(() => res.send({success: DONE})).catch(next);

    }
}
