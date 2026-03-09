const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationPayloadSchema } = require('./schema');

/**
 * CollaborationsValidator is a class that will validate the payload
 * that will be used to add a collaboration between a playlist and a user
 */
const CollaborationsValidator = {
    validateCollaborationPayload: (payload) => {
        const validationResult = CollaborationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = CollaborationsValidator;