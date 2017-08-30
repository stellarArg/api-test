
const
  Bluebird = require('bluebird');


class Controller {

  static noop(req, res) {
    Bluebird.resolve(null)
      .then(res.ok.bind(res));
  }

}

module.exports = Controller;
