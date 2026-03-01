const ClientError = require('./ClientError');

/**
 * AuthenticationError is a class that will be used to handle all of the authentication errors
 */
class AuthenticationError extends ClientError {
    constructor(message) {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

module.exports = AuthenticationError;