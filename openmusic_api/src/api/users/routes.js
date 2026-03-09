/**
 * routes is a function that will be used to handle all of the routes
 */
const routes = (handler) => [
    {
        method: 'POST',
        path: '/users',
        handler: handler.postUserHandler,
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: handler.getUserByIdHandler,
    },
    {
        method: 'GET',
        path: '/users',
        handler: handler.getUsersByUsernameHandler,
    },
];

module.exports = routes;