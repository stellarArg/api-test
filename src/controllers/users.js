import {services} from '@indec/heimdall';
import {findIndex, forEach, filter} from 'lodash';
import {PermissionService, UsersService, UserHierarchyService} from '../services';

const {UserService} = services;

export default class UsersController {
    static users(req, res, next) {
        return UsersService.getUsersByRol(req.user).then(
            users => res.send({users})
        ).catch(next);
    }

    static profile(req, res, next) {
        return UserService.fetchOne(req.user._id).then(
            response => res.send(response)
        ).catch(next);
    }

    static findById(req, res, next) {
        return UserService.fetchOne(req.query.id).then(profile => res.send(profile)).catch(next);
    }

    static find(req, res, next) {
        const rol = PermissionService.getPermissions(req.user.roles);
        const {state} = req.user;
        return Promise.all([
            UserHierarchyService.getAssignedUsers(req.user),
            UserService.search({rol, state})
        ]).then(
            ([assignedUsers, heimdallUsers]) => {
                forEach(assignedUsers, user => heimdallUsers.splice(findIndex(heimdallUsers, u => u._id == user._id), 1));
                return UserHierarchyService.getUsersByRol(req.user, heimdallUsers).then(freeUsers =>
                    ({assignedUsers, heimdallUsers: freeUsers}));
            }
        ).then(
            users => res.send({users})
        ).catch(next);

    }

    static saveHierarchy(req, res, next) {
        const assigns = filter(req.body.assigned, users => users.modified);
        const unassigned = filter(req.body.unassigned, users => users.modified);
        return UserHierarchyService.saveHierarchy(req.user, assigns, unassigned).then(() => res.send({success: true})).catch(next);
    }
}
