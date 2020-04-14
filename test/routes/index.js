require('dotenv').config();
const get = require('lodash/get');
const Sinon = require('sinon');

require('../../src/global');
const Logger = include('helpers/logger');
Sinon.stub(Logger, 'info').returns('');

const App = include('app');
const app = new App();
app.test();
const request = require('supertest')(app.app);

const getWrappingErrors = error => {
    return get(error, 'assertion.params.actual.errors');
};

module.exports = {
    request,
    Sinon,
    getWrappingErrors
};
