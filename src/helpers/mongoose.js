const mongoose = require('mongoose');
const logger = include('helpers/logger');

class Mongoose {
    static configure() {
        const {MONGO_URL} = process.env;
        if (MONGO_URL) {
            mongoose.Promise = Promise;
            mongoose.set('useCreateIndex', true);
            mongoose.connect(MONGO_URL, {useNewUrlParser: true});
            mongoose.connection.once('open',
                () => logger.info(
                    'Mongoose connected'
                )
            );
            mongoose.connection.on('close', () => logger.info('connection closed'));
            mongoose.connection.on('error', err => logger.error(`connection error ${err}`));
        }
    }
}

module.exports = Mongoose;
