const ExportSongsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * ExportsValidator is a class that will be used to
 * handle all of the export validators
 */
const ExportsValidator = {
    validateExportSongsPayload: (payload) => {
        const validationResult = ExportSongsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportsValidator;
