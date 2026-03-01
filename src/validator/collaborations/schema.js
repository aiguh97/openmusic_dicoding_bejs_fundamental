const Joi = require('joi');

/**
 * CollaborationPayloadSchema is a schema for collaboration payload
 */
const CollaborationPayloadSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };