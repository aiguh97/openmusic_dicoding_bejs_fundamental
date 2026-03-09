const routes = require('./routes');

const PlaylistsHandler = require('./handler');

module.exports = {
    name: 'openmusic-playlists',
    version: '1.0.0',
    // eslint-disable-next-line max-len, object-curly-newline
    register: async (server, { playlistsService, songsService, activitiesService, tokenManager, validator }) => {
        const playlistHandler = new PlaylistsHandler(
            playlistsService,
            songsService,
            activitiesService,
            tokenManager,
            // eslint-disable-next-line comma-dangle
            validator
        );

        server.route(routes(playlistHandler));
    },
};