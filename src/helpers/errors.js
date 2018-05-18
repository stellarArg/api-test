import CustomErrors from 'node-custom-errors';

const Errors = {};

const createError = (errorName) => {
    Errors[errorName] = CustomErrors.create(errorName);
};

createError('NotImplementedError');
createError('NotFoundError');
createError('ValidationError');

export default Errors;
