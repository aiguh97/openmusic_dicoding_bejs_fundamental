const Joi = require('joi');

/**
 * PostAuthenticationPayloadSchema is a schema that will be used to
 * validate the POST request payload
 */
const PostAuthenticationPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

/**
 * PutAuthenticationPayloadSchema is a schema that will be used to
 * validate the PUT request payload
 */
const PutAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

/**
 * DeleteAuthenticationPayloadSchema is a schema that will be used to
 * validate the DELETE request payload
 */
const DeleteAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    PostAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
};