const autoBind = require('auto-bind');

/**
 * UsersHandler is a class that will be used to handle all of the routes
 */
class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    /**
     * postUserHandler is a method that will be used to handle the POST request to add a user
     */
    async postUserHandler(request, h) {
        this._validator.validateUserPayload(request.payload);
        const { username, password, fullname } = request.payload;

        const userId = await this._service.addUser({ username, password, fullname });

        const response = h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId,
            },
        });
        response.code(201);
        return response;
    }

    /**
     * getUserByIdHandler is a method that will be used to handle the GET request
     * to get a user by id
     */
    async getUserByIdHandler(request) {
        const { id } = request.params;

        const user = await this._service.getUserById(id);

        return {
            status: 'success',
            data: {
                user,
            },
        };
    }

    /**
     * getUsersByUsernameHandler is a method that will be used to handle the GET request
     * to get a user by username
     */
    async getUsersByUsernameHandler(request) {
        const { username = '' } = request.query;
        const users = await this._service.getUsersByUsername(username);
        return {
            status: 'success',
            data: {
                users,
            },
        };
    }
}

module.exports = UsersHandler;