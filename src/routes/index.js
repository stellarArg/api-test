import {Router} from 'express';
import AuthenticateMiddleware from './middlewares/authenticate';
import {AppInformation} from '../model';
import {StatusController} from '../controllers';

import Api from './api';
import Mobile from './mobile';

export default class Routes {
    static configure(app) {
        app.get('/version', (req, res) => 
            AppInformation.find().sort({$natural: -1}).then(app => res.send({app: app[0]}))
        );
        app.get('/ping', StatusController.ping);
        app.get('/ready', StatusController.getStatus);
        app.get('/health', StatusController.getHealth);
        app.use('/api', AuthenticateMiddleware(), Api(Router()));
        app.use('/mobile', AuthenticateMiddleware({handleTokenExpired: true}), Mobile(Router()));
    }
}
