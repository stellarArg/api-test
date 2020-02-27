const map = require('lodash/map');
const keys = require('lodash/keys');

const {
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    CONFLICT,
    NOT_FOUND,
    UNPROCESSABLE,
    GENERIC_ERROR
} = include('helpers/error');

const unauthorized = (err, req, res) => {
    res.status(UNAUTHORIZED).send({
        ok: false,
        message: err.message || 'Unauthorized',
        errors: [err]
    });
};

const forbidden = (err, req, res) => {
    res.status(FORBIDDEN).send({
        ok: false,
        message: err.message || 'Forbidden',
        errors: [err]
    });
};

const conflict = (err, req, res) => {
    res.status(CONFLICT).send({
        ok: false,
        message: err.message || 'Conflict',
        errors: [err]
    });
};

const badRequest = (err, req, res) => {
    res.status(BAD_REQUEST).send({
        ok: false,
        message: err.message || 'Bad Request',
        errors: [err]
    });
};

const unprocessable = (err, req, res) => {
    res.status(UNPROCESSABLE).send({
        ok: false,
        message: err.message || 'Unprocessable entity',
        errors: [err]
    });
};

// If there's nothing left to do after all this (and there's no error),
// return a 404 error.
const notFound = (err, req, res) => {
    res.status(NOT_FOUND).send({
        ok: false,
        message: err.message || 'The requested resource could not be found'
    });
};

// If there's still an error at this point, return a generic 500 error.
const genericError = (err, req, res) => {
    res.status(GENERIC_ERROR).send({
        ok: false,
        message: err.message || 'Internal server error',
        errors: [err]
    });
};

// If there's nothing left to do after all this (and there's no error),
// return a 404 error.
const catchall = (req, res) => {
    res.status(NOT_FOUND).send({
        ok: false,
        message: 'The requested resource could not be found'
    });
};

const exportables = {
    unauthorized,
    forbidden,
    conflict,
    badRequest,
    unprocessable,
    genericError,
    notFound,
    catchall
};

// All exportables stored as an array (e.g., for including in Express app.use())
const all = map(keys(exportables), key => exportables[key]);

module.exports = {
    ...exportables,
    all
};
