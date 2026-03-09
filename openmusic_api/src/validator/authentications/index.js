const {
    PostAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * AuthenticationsValidator is a class that will be used to
 * handle all of the authentication validators
 */
const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
        const validationResult = PostAuthenticationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePutAuthenticationPayload: (payload) => {
        const validationResult = PutAuthenticationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateDeleteAuthenticationPayload: (payload) => {
        const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AuthenticationsValidator;