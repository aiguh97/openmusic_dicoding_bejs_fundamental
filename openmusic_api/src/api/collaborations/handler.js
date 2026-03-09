const autoBind = require('auto-bind');

/**
 * CollaborationHandler is a class that will be used to handle all of the routes
 */
class CollaborationHandler {
    constructor(collaborationsService, usersService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._usersService = usersService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        autoBind(this);
    }

    /**
     * postCollaborationHandler is a method that will be used to handle the POST request
     * of adding a collaboration to a playlist
     */
    async postCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload);
        const { playlistId, userId } = request.payload;
        const { id: credentialId } = request.auth.credentials;
        await this._usersService.verifyUser(userId);
        await this._playlistsService.verifyPlaylist(playlistId);
        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

        // eslint-disable-next-line max-len
        const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);
        const response = h.response({
            status: 'success',
            message: 'Berhasil menambahkan collaboration',
            data: {
                collaborationId,
            },
        });

        response.code(201);
        return response;
    }

    /**
     * deleteCollaborationHandler is a method that will be used to handle the DELETE request
     * of deleting a collaboration from a playlist
     */
    async deleteCollaborationHandler(request) {
        this._validator.validateCollaborationPayload(request.payload);
        const { playlistId, userId } = request.payload;
        const { id: credentialId } = request.auth.credentials;
        await this._usersService.verifyUser(userId);
        await this._playlistsService.verifyPlaylist(playlistId);
        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

        await this._collaborationsService.deleteCollaboration(playlistId, userId);
        return {
            status: 'success',
            message: 'Berhasil menghapus collaboration',
        };
    }
}

module.exports = CollaborationHandler;