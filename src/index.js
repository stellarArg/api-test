require('./global');
const os = require('os');
const cluster = require('cluster');
const forEach = require('lodash/forEach');
const App = require('./app');

const nativeEvent = require('./helpers/nativeEvent');

const app = new App();

if (process.env.NODE_ENV === 'production') {
    if (cluster.isMaster) {
        nativeEvent.process();
        const CPUS = os.cpus();
        forEach(CPUS, () => cluster.fork());
        nativeEvent.cluster(cluster);
    } else {
        app.init();
    }
} else {
    app.init();
}
