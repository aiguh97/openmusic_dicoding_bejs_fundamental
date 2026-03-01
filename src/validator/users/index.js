const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema } = require('./schema');

/**
 * UsersValidator is a class that will be used to validate the payload
 */
const UsersValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UsersValidator;