import Express from 'express';
import DotEnv from 'dotenv';
import ConfigDevelopment from '../config/development';
import ConfigProduction from '../config/production';
import ConfigStaging from '../config/staging';
import ConfigTest from '../config/test';
import Router from './routes';

DotEnv.load();
const App = Express();
let Config = null;

switch (process.env.NODE_ENV) {
    case 'development':
        Config = ConfigDevelopment; break;
    case 'production':
        Config = ConfigProduction; break;
    case 'staging': 
        Config = ConfigStaging; break;
    default:
        Config = ConfigTest; break;
}

Config.configure(App);
Router.configure(App);

export default App;
