import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Morgan from 'morgan';
import 'node-friendly-response';
import DotEnv from 'dotenv';

import MongooseConfig from '../src/helpers/mongoose';

DotEnv.load();

const {SERVER_BODY_LIMIT, MORGAN_FORMAT} = process.env;

export default class Config {
    static configure(app) {
        app.use(BodyParser.json(SERVER_BODY_LIMIT ? {limit: SERVER_BODY_LIMIT} : undefined));
        app.use(BodyParser.urlencoded({extended: true}));
        app.use(CookieParser());
        app.use(Morgan(MORGAN_FORMAT || 'dev'));
        MongooseConfig.configure();
    }
}
