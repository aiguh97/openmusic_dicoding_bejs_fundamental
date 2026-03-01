const Joi = require('joi');

/**
 * PlaylistPayloadSchema is a schema for validating playlist payload
 */
const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

/**
 * PlaylistSongPayloadSchema is a schema for validating playlist song payload
 */
const PlaylistSongPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema, PlaylistSongPayloadSchema };