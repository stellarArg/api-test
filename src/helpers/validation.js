const {isUuid} = require('uuidv4');

const filter = require('lodash/filter');
const isNil = require('lodash/isNil');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');

class Validation {
    static validateCommaSeparatedIntegers(ids) {
        return /^[\d,]+$/g.test(ids);
    }

    /**
     * Validates if the object has defined the required values.
     * @param obj A object to tested.
     * @param fields A list of required fields.
     * @returns {Array} Returns the list of required missing fields.
     */
    static required(obj, fields) {
        return filter(fields, fieldName => isNil(get(obj, fieldName)) || isEmpty(get(obj, fieldName)));
    }

    /**
     * Validates if the given value is a valid email address.
     * @param email A value to test.
     * @returns {boolean} Returns true when the value is a valid email address, otherwise false.
     */
    static email(email) {
        return new RegExp('^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$').test(email);
    }

    static password(pass) {
        if (pass.length < 6) {
            return 'Password must be 6 characters long.';
        }

        if (!/[A-Z]/.test(pass) && !/[a-z]/.test(pass)) {
            return 'Password must have at least one letter.';
        }

        if (!/\d/.test(pass)) {
            return 'Password must have at least one number.';
        }
    }

    /**
     * Validates if the given value is a valid object id.
     * @param objectId A value to test.
     * @returns {boolean} true when the value is a valid object id, otherwise false.
     */
    static objectId (objectId ) {
        return isUuid(objectId);
    }
}

module.exports = Validation;
