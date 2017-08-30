
const debug = require('debug')('api');

var app = require('..');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  debug(`Server api started on port ${process.env.PORT} in ${process.env.NODE_ENV} environment..`);
});
