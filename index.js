require('dotenv').load();
const winston = require('winston');
const app = require('./app/index');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
    winston.info(`Server api started on port ${process.env.PORT} in ${process.env.NODE_ENV} environment..`);
});
