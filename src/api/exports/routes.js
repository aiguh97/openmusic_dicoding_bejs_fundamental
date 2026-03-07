/**
 * routes handles the routes for the export songs feature
 */
const routes = (handler) => [
    {
        method: 'POST',
        path: '/export/playlists/{playlistId}',
        handler: handler.postExportSongsHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;
