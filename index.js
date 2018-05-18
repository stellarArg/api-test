import DotEnv from 'dotenv';
import winston  from 'winston';
import App from './src/index';

DotEnv.load();

const {NODE_ENV, PORT} = process.env;

App.listen(PORT, () => winston.info('Started at port %s in %s environment..', PORT, NODE_ENV));
