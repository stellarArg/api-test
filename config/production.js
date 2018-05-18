import Cors from 'cors';
import Config from './config';

export  default class Production extends Config {
    static configure(app) {
        super.configure(app);
        app.use(Cors());
    }
}
