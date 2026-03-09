const Joi = require('joi');

/**
 * ExportSongsPayloadSchema is a schema that will be used to validate the export songs payload.
 */
const ExportSongsPayloadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportSongsPayloadSchema;
