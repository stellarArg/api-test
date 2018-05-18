import request from 'request';

const {AUTH_ENDPOINT} = process.env;

export default class SignInController {
    static signIn(req, res) {
        const {username, password} = req.body;
        request.post({url: `${AUTH_ENDPOINT}auth/login`, body: {username, password}, json: true}, (err, response) => {
            res.send(response.body);
        });
    }
}
