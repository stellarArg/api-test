
const
  mongoose = require('mongoose'),
  debug = require('debug');

const
  info = debug('mongoose'),
  error = debug('mongoose:error');


class Mongoose {

  static configure() {
    mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
    mongoose.connection.once('open', () => info(`connection opened to ${process.env.MONGODB_URI}`));
    mongoose.connection.on('close', () => info('connection closed'));
    mongoose.connection.on('error', (err) => error(`connection error ${err}`));
  }

}

module.exports = Mongoose;
