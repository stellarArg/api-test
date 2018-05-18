import {services} from '@indec/heimdall';
import {map, isEmpty, forEach, findIndex} from 'lodash';

import {UserHierarchy} from '../model';
import {PermissionService} from '.';

const {UserService} = services;

export default class UserHierarchyService {
    static getAssignedUsers(user) {
        const query = PermissionService.getUserRolAndQuery(user);
        return UserHierarchy.find(query).lean().exec().then(
            hierarchy => {
                if (!hierarchy.length) {
                    return [];
                }
                const idsToFind = map(hierarchy, h => h._id);
                return UserService.fetch(idsToFind);
            });
    }

    static getUsersByRol(user, heimdallUsers) {
        const idsToFind = map(heimdallUsers, h => h._id);
        const {param} = PermissionService.getHierarchyParams(user);
        return UserHierarchy.find({
            [param]: {$exists: true},
            _id: {$in: idsToFind}
        }, {_id: 1}
        ).exec().then(users => {
            forEach(users, user => heimdallUsers.splice(findIndex(heimdallUsers, u => u._id == user._id), 1));
            return heimdallUsers;
        }).catch(ex => ex);
    }

    static saveHierarchy(user, assigns, unassigned) {
        const queryParams = PermissionService.getHierarchyParams(user);
        return new Promise((resolve, reject) => {
            if (!isEmpty(assigns)) {
                forEach(assigns, assign => {
                    UserHierarchy.findOne({[queryParams.param]: assign[queryParams.param], _id: assign._id},
                        (err, hierarchy) => {
                            if(!err) {
                                if(!hierarchy) {
                                    hierarchy = new UserHierarchy({_id: assign._id});
                                }
                                hierarchy[queryParams.param] = assign[queryParams.param];
                                hierarchy.save();
                            } else {
                                reject(err);
                            }
                        });
                });
            }

            if (!isEmpty(unassigned)) {
                forEach(unassigned, unassigned => {
                    UserHierarchy.find({_id: unassigned._id}).remove().exec();
                });
            }
            resolve(true);
        });
    }
}
