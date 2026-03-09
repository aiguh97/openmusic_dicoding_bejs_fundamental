const autoBind = require('auto-bind');

// UploadsHandler is a class that handles uploads.
class UploadsHandler {
    constructor(storageService, albumsService, validator) {
        this._storageService = storageService;
        this._albumsService = albumsService;
        this._validator = validator;

        autoBind(this);
    }

    // postUploadAlbumCoverHandler is a function that handles POST requests to /albums/{id}/covers.
    async postUploadAlbumCoverHandler(request, h) {
        const { id } = request.params;
        const { cover } = request.payload;
        
        // Get lowercase headers for validation
        const lowerCaseHeaders = {};
        Object.keys(cover.hapi.headers).forEach((key) => {
            lowerCaseHeaders[key.toLowerCase()] = cover.hapi.headers[key];
        });
        
        this._validator.validateImageHeaders(lowerCaseHeaders);

        const filename = await this._storageService.writeFile(cover, cover.hapi);
        const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/cover/${filename}`;

        await this._albumsService.editAlbumCover(id, coverUrl);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
        });
        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;
