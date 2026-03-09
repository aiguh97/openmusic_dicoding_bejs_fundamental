const Joi = require('joi');

/**
 * routes is a function that will be used to handle all of the routes
 */
const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postSongHandler,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsHandler,
        options: {
            validate: {
                query: Joi.object({
                    title: Joi.string(),
                    performer: Joi.string(),
                }),
            },
        },
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongByIdHandler,
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongByIdHandler,
    },
];

module.exports = routes;