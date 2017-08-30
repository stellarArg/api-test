
const
  Errors = require('../helpers/errors');


const NotFoundError = Errors.NotFoundError;
const ValidationError = Errors.ValidationError;


class Controller {

  constructor(service) {
    this._service = service;
  }

  create(req, res) {
    return this._service.create(req.body)
      .then(res.created.bind(res))
      .catch(ValidationError, res.badRequest.bind(res))
      .catch(res.internalServerError.bind(res));
  }

  delete(req, res) {
    return this._service.deleteById(req.params.id)
      .then(res.noContent.bind(res))
      .catch(NotFoundError, res.notFound.bind(res))
      .catch(res.internalServerError.bind(res));
  }

  findAll(req, res){
    return this._service.findAll()
      .then(res.ok.bind(res))
      .catch(NotFoundError, res.notFound.bind(res))
      .catch(res.internalServerError.bind(res));
  }

  findById(req, res){
    return this._service.findById(req.params.id)
      .then(res.ok.bind(res))
      .catch(NotFoundError, res.notFound.bind(res))
      .catch(res.internalServerError.bind(res));
  }

  patch(req, res) {
    return this._service.modify(req.params.id, req.body)
      .then(res.ok.bind(res))
      .catch(res.internalServerError.bind(res));
  }

}

module.exports = Controller;
