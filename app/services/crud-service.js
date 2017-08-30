
const
  _ = require('lodash'),
  mongoose = require('mongoose'),

  Utils = require('../models/utils'),
  Errors = require('../helpers/errors');

const ValidationError = Errors.ValidationError;
const MongooseError = mongoose.Error;


const _getRefAttributesNames = (model) =>
  _.chain(model.schema.obj)
  .mapValues('ref')
  .omitBy(_.isUndefined)
  .keys()
  .value()
  .join(' ');


class Service {

  constructor(model) {
    this._model = model;
  }

  findAll(opts) {
    return this._model
      .find({})
      .populate(_getRefAttributesNames(this._model))
      .select(opts && opts.select || '-__v')
      .execAsync();
  }

  findById(id, opts) {
    return this._model
      .findOne({ _id: id })
      .select('-__v')
      .populate(_getRefAttributesNames(this._model))
      .populate(opts && opts.populate || '')
      .execAsync()
      .tap(Utils.checkExistence)
      .catch(MongooseError.CastError, (err) => Utils.throwNotFound(this._model.modelName, id));
  }

  create(elem) {
    return this._model
      .createAsync(elem)
      .catch(MongooseError.ValidationError, (err) => {
        throw new ValidationError(`${err.message}: ${err.toString()}`);
      });
  }

  deleteById(id) {
    return this._model
      .removeAsync({ _id: id })
      .catch(MongooseError.CastError, (err) => Utils.throwNotFound(this._model.modelName, id));
  }

  modify(id, data) {
    const opts = { upsert: true, new: true };
    return this._model
      .findOneAndUpdateAsync({ _id: id }, data, opts)
      .tap(Utils.checkExistence)
      .catch(MongooseError.CastError, (err) => Utils.throwNotFound(this._model.modelName, id));
  }

}

module.exports = Service;
