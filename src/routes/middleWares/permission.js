const every = require('lodash/every');
const includes = require('lodash/includes');
const castArray = require('lodash/castArray');

const permissionMiddleware = roles =>
    (req, res, next) => {
        if (!roles || every(castArray(roles), permission => !includes(req.user.roles, permission))) {
            return res.status(403).send({message: 'You don\'t have permission to perform this action.'});
        }
        next();
    };

module.exports = permissionMiddleware;
