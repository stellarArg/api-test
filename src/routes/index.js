const {Router} = require('express');
const fs = require('fs');
const path = require('path');

module.exports = app => {
    const dirs = fs.readdirSync(__dirname);

    dirs.map(dir => {
        if (!dir.includes('index.js')) {
            const api = dir.replace('.js', '')
            app.use(`/${api}`, require(path.resolve(__dirname, dir))(Router()));
            console.log(`Loading ${api} api...`);
        }
    })

}