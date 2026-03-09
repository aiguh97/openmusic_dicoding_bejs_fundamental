const autoBind = require('auto-bind');

/**
 * AlbumsHandler is a class that will be used to handle all of the routes
 */
class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    /**
     * postAlbumHandler is a method that will be used to handle the POST request to add a album
     */
    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year } = request.payload;

        const albumId = await this._service.addAlbum({ name, year });

        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
            },
        });
        response.code(201);
        return response;
    }

    /**
     * getAlbumsHandler is a method that will be used to handle the GET request to get all albums
     */
    async getAlbumsHandler() {
        const albums = await this._service.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    /**
     * getAlbumByIdHandler is a method that will be used to handle the GET request
     * to get a album by id
     */
    async getAlbumByIdHandler(request) {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return {
            status: 'success',
            data: {
                album,
            },
        };
    }

    /**
     * putAlbumByIdHandler is a method that will be used to handle the PUT request
     * to edit a album by id
     */
    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;

        await this._service.editAlbumById(id, request.payload);

        return {
            status: 'success',
            message: 'Album berhasil diperbarui',
        };
    }

    /**
     * deleteAlbumByIdHandler is a method that will be used to handle the DELETE request
     * to delete a album by id
     */
    async deleteAlbumByIdHandler(request) {
        const { id } = request.params;
        await this._service.deleteAlbumById(id);

        return {
            status: 'success',
            message: 'Album berhasil dihapus',
        };
    }
}

module.exports = AlbumsHandler;