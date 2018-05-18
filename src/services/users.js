/* eslint lodash/consistent-return: 0 */
import {services} from '@indec/heimdall';
import {includes, map, find, concat, orderBy} from 'lodash';
import PermissionService from '.';
import {UserHierarchy, States} from'../model';
import enums from '../common/enums';

const {roles} = enums;
const {UserService} = services;

export default class UsersService {
    static getUserService() {
        return UserService;
    }
    static fetchOne(filter) {
        return UserService.fetchOne(filter);
    }

    static getUsersByRol(profile) {
        if(includes(profile.roles, roles.NATIONAL_COORDINATOR) || includes(profile.roles, roles.NATIONAL_COORDINATOR_RO)) {
            return UserService.fetchAll().then(profile => {
                return States.find().exec().then(stateInfo =>
                    map(profile, user => {
                        const state = find(stateInfo, state => state._id == user.state);
                        if(state) {
                            user.stateName = state.name;
                        }
                        return user;
                    })
                );
            });
        } else if (includes(profile.roles, roles.COORDINATOR)) {
            return Promise.all([
                UserService.search({rol: roles.SUB_COORDINATOR, state: profile.state}),
                UserService.search({rol: roles.SUPERVISOR, state: profile.state}),
                UserService.search({rol: roles.RAE, state: profile.state}),
                UserService.search({rol: roles.POLLSTER, state: profile.state})]).then(
                ([subCoordinator, supervisor, rae, pollster]) => {
                    const users = concat([], subCoordinator, supervisor, rae, pollster);
                    return States.find().exec().then(stateInfo =>
                        map(users, user => {
                            const state = find(stateInfo, state => state._id == user.state);
                            if(state) {
                                user.stateName = state.name;
                            }
                            return user;
                        })
                    );
                }
            );
        } else if (includes(profile.roles, roles.SUB_COORDINATOR)) {
            return Promise.all([
                UserService.search({rol: roles.SUPERVISOR, state: profile.state}),
                UserService.search({rol: roles.RAE, state: profile.state}),
                UserService.search({rol: roles.POLLSTER, state: profile.state})]).then(
                ([supervisor, rae, pollster]) => {
                    const users = concat([], supervisor, rae, pollster);
                    return States.find().exec().then(stateInfo =>
                        map(users, user => {
                            const state = find(stateInfo, state => state._id == user.state);
                            if(state) {
                                user.stateName = state.name;
                            }
                            return user;
                        })
                    );
                }
            );
        } else if (includes(profile.roles, roles.SUPERVISOR)) {
            return Promise.all([
                UserService.search({rol: roles.RAE, state: profile.state}),
                UserService.search({rol: roles.POLLSTER, state: profile.state})]).then(
                ([rae, pollster]) => {
                    const users = concat([], rae, pollster);
                    return States.find().exec().then(stateInfo =>
                        map(users, user => {
                            const state = find(stateInfo, state => state._id == user.state);
                            if(state) {
                                user.stateName = state.name;
                            }
                            return user;
                        })
                    );
                }
            );
        }
        return null;
    }

    static getUsers(filter) {
        return UserService.fetchOne(filter).then(profile => {
            let query;
            if (includes(profile.roles, roles.COORDINATOR)) {
                query = {coordinator: profile._id};
            } else if (includes(profile.roles, roles.SUB_COORDINATOR)) {
                query = {$or: [{subCoordinator: profile._id}, {subCoordinator: null}]};
            } else if (includes(profile.roles, roles.SUPERVISOR)) {
                query = {supervisor: profile._id};
            }
            return UserHierarchy.find(query).lean().exec().then(
                hierarchy => {
                    if (!hierarchy.length) {
                        return [];
                    }
                    const idsToFind = map(hierarchy, h => h._id);
                    return UserService.fetch(idsToFind);
                });
        });
    }

    static users(req) {
        return UserService.fetchOne(req.user.sub).then(
            profile => {
                const [rol, query] = [
                    PermissionService.getPermissions(profile.roles), PermissionService.getUserRolAndQuery(profile)
                ];
                if (rol === roles.NATIONAL_COORDINATOR) {
                    return UserService.fetchAll().then(profile => {
                        return States.find().exec().then(stateInfo =>
                            map(profile, user => {
                                const state = find(stateInfo, state => state._id == user.state);
                                if(state) {
                                    user.stateName = state.name;
                                }
                                return user;
                            })
                        );
                    });
                } else if (rol === roles.SUB_COORDINATOR) {
                    const {state} = profile;
                    return UserService.search({rol, state}).then(profile => {
                        return States.find().exec().then(stateInfo =>
                            map(profile, user => {
                                const state = find(stateInfo, state => state._id == user.state);
                                if(state) {
                                    user.stateName = state.name;
                                }
                                return user;
                            })
                        );
                    });
                } else {
                    return UserHierarchy.find(query).lean().exec().then(
                        hierarchy => {
                            if (!hierarchy.length) {
                                return [];
                            }
                            const idsToFind = map(hierarchy, h => h._id);
                            return UserService.fetch(idsToFind).then(profile => {
                                return States.find().exec().then(stateInfo =>
                                    map(profile, user => {
                                        const state = find(stateInfo, state => state._id == user.state);
                                        if(state) {
                                            user.stateName = state.name;
                                        }
                                        return user;
                                    })
                                );
                            });
                        }
                    );
                }
            }
        );
    }

    static UsersToAssign(profile, stateId) {
        const state =  includes(profile.roles, roles.NATIONAL_COORDINATOR) ? stateId : profile.state;
        return Promise.all([
            UserService.search({rol: roles.SUB_COORDINATOR, state}),
            UserService.search({rol: roles.SUPERVISOR, state}),
            UserService.search({rol: roles.POLLSTER, state})]).then(
            ([subCoordinator, supervisor, pollster]) => {
                subCoordinator = orderBy(subCoordinator, ['surname', 'name']);
                supervisor = orderBy(supervisor, ['surname', 'name']);
                pollster = orderBy(pollster, ['surname', 'name']);
                if (includes(profile.roles, roles.NATIONAL_COORDINATOR) || includes(profile.roles, roles.COORDINATOR)) {
                    return {subCoordinator, supervisor, pollster};
                }
                return {supervisor, pollster};
            }
        );
    }

    static getReassignUsers(profile, stateId) {
        const state = roles.NATIONAL_COORDINATOR ? stateId : profile.state;
        return Promise.all([
            UserService.search({rol: roles.POLLSTER, state: parseInt(state)}),
            UserService.search({rol: roles.SUPERVISOR, state: parseInt(state)})
        ]).then(([pollsters, recuperators]) => {
            let users = pollsters;
            if (!includes(profile.roles, roles.SUPERVISOR)) {
                users = concat(pollsters, recuperators);
            } else if (includes(profile.roles, roles.SUPERVISOR)) {
                users.push(profile);
            }
            return users;
        });
    }

    static getPollstersAndTeamLeaders(profile, stateId) {
        const state = roles.NATIONAL_COORDINATOR ? stateId : profile.state;
        return Promise.all([
            UserService.search({rol: roles.POLLSTER, state: parseInt(state)}),
            UserService.search({rol: roles.SUPERVISOR, state: parseInt(state)})
        ]).then(([pollsters, recuperators]) => concat(pollsters, recuperators));
    }

}
