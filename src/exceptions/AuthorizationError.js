const ClientError = require('./ClientError');

/**
 * AuthorizationError is a class that will be used to handle authorization error
 */
class AuthorizationError extends ClientError {
    constructor(message) {
        super(message, 403);
        this.name = 'AuthorizationError';
    }
}

module.exports = AuthorizationError;