const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    // eslint-disable-next-line object-curly-newline
    register: async (server, { authenticationsService, usersService, tokenManager, validator }) => {
        const authenticationsHandler = new AuthenticationsHandler(
            authenticationsService,
            usersService,
            tokenManager,
            // eslint-disable-next-line comma-dangle
            validator
        );
        server.route(routes(authenticationsHandler));
    },
};