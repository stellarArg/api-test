import Cors from 'cors';
import Config from './config';

export  default class Development extends Config {
    static configure(app) {
        super.configure(app);
        app.use(Cors({
            credentials: true,
            origin: /^http:\/\/localhost/
        }));
    }
}
