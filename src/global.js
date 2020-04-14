const pathFunc = require('path');
global.base_dir = __dirname;

global.abs_path = function(path) {
    return base_dir + path;
};

global.abs_root_path = function(path) {
    return pathFunc.resolve(base_dir, '..', path);
};

global.root_path = function(path) {
    return require(pathFunc.resolve(__dirname, '..', path));
};

global.include = function(file) {
    return require(abs_path('/' + file));
};

const Logger = include('helpers/logger');

Logger.info('Global vars loaded');
