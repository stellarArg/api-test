/* eslint-disable lodash/prefer-constant */
const path = require('path');
const fs = require('fs');

class Errors {
    static get BAD_REQUEST () {
        return 400;
    }
    static get UNAUTHORIZED () {
        return 401;
    }
    static get FORBIDDEN () {
        return 403;
    }
    static get NOT_FOUND () {
        return 404;
    }

    static get CONFLICT () {
        return 409;
    }

    static get UNPROCESSABLE() {
        return 422;
    }

    static get GENERIC_ERROR() {
        return 500;
    }

    static get SUCCESS() {
        return 200;
    }

    static createError({
        status = Errors.GENERIC_ERROR, message = 'Something went wrong'
    }) {
        const error = new Error(message);
        error.status = status;
        return error;
    }

    static sendError(res) {
        const img = fs.readFileSync(path.resolve(__dirname, '..', '..', 'public/U3DoNsS.jpg'));
        res.writeHead(Errors.UNAUTHORIZED, {'Content-Type': 'text/html'});
        res.write('<html><body style="background-color: #000"><h2 style="color: #fff; text-align: center; left: 0, right: 0">Entiendo que quer&eacute;s ver lo que hay pero necesitas permisos especiales</h2>');
        res.write(`<img style="margin-left: 35%" width="400px" src="data:image/jpeg;base64,${Buffer.from(img).toString('base64')}`);
        return res.end('"/></body></html>');
    }

    static send404(res) {
        res.writeHead(Errors.NOT_FOUND, {'Content-Type': 'text/html'});
        res.write('<html><head><link rel="icon" type="image/png" href="/public/kaizen.png" sizes="64x64"></head>');
        res.write('<body style="background-color: #000"><h2 style="margin-top: 10%; color: #fff; text-align: center; left: 0, right: 0">Encontraste algo Oculto......</h2>');
        res.write('<h4 style="color: #fff; text-align: center; left: 0, right: 0">404 P&aacute;gina no encontrada</h4>');
        return res.end('</body></html>');
    }
}

module.exports = Errors;
