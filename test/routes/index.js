require('dotenv').config();
const Sinon = require('sinon');

require('../../src/global');

const Logger = include('helpers/logger');
const App = include('app');
const app = new App();
app.test();
const request = require('supertest')(app.app);
Sinon.stub(Logger, 'info').returns('');
module.exports = {
    request,
    Sinon
};
