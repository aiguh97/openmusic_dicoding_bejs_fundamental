const Joi = require('joi');

/**
 * UserPayloadSchema is a class that defines the schema for the payload
 */
const UserPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
});

module.exports = { UserPayloadSchema };