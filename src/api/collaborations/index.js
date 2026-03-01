const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'openmusic-collaborations',
    verson: '1.0.0',
    // eslint-disable-next-line object-curly-newline, max-len
    register: async (server, { collaborationsService, usersService, playlistsService, validator }) => {
        const collaborationsHandler = new CollaborationHandler(
            collaborationsService,
            usersService,
            playlistsService,
            // eslint-disable-next-line comma-dangle
            validator
        );
        server.route(routes(collaborationsHandler));
    },
};