const {Router} = require('express');
const {errorHandler} = require('./middleWares');

const {StatusController} = include('controllers');
const Logger = include('helpers/logger');
/**
 * @class Routes
 * links Routes of Application
 * @description
 * <b> /ping </b> returns current version of app </br>
 * <b> /ready </b> Check if everything is ok and running </br>
 * <b> /health </b> Check if external agents are ok </br>
 * <b> /public-api </b> Links publics for external and not logging request /br>
 * <b> /api </b> main link, this manage all functions of be </br>
 * <b> * </b> returns error page when not matching url can be found </br>
 */
class Routes {
    static configure(app) {
        app.get('/ping', StatusController.ping);
        app.get('/ready', StatusController.getStatus);
        app.get('/health', StatusController.getHealth);
        app.use('/api', /* authenticate, */ require('./api')(Router()));

        Logger.info('Loading public-api...');
        app.use('/public-api', require('./public-api')(Router()));

        app.use(errorHandler);
    }
}

module.exports = Routes;
