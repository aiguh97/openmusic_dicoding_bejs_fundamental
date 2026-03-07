const autoBind = require('auto-bind');

/**
 * UserAlbumLikesHandler is a class that will be used to handle all HTTP requests
 * related to user album likes.
 */
class UserAlbumLikesHandler {
    constructor(userAlbumLikesService, albumsService) {
        this._userAlbumLikesService = userAlbumLikesService;
        this._albumsService = albumsService;

        autoBind(this);
    }

    /**
     * postUserAlbumLikeHandler handles POST HTTP requests to like/unlike an album.
     */
    async postUserAlbumLikeHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { id: albumId } = request.params;

        await this._albumsService.getAlbumById(albumId);

        await this._userAlbumLikesService.likeAlbum(credentialId, albumId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil like albums',
        });
        response.code(201);
        return response;
    }

    /**
     * getUserAlbumLikeHandler handles GET HTTP requests to get sum of user likes for an album.
     */
    async getUserAlbumLikeHandler(request, h) {
        const { id } = request.params;

        await this._albumsService.getAlbumById(id);

        const { likes, from } = await this._userAlbumLikesService.getAlbumLikes(id);

        if (from === 'cache') {
            const response = h.response({
                status: 'success',
                data: {
                    likes,
                },
            });
            response.code(200);
            response.header('X-Data-Source', from);
            return response;
        }

        const response = h.response({
            status: 'success',
            data: {
                likes,
            },
        });
        response.code(200);
        return response;
    }

    /**
     * deleteUserAlbumLikeHandler handles DELETE HTTP requests to unlike an album.
     */
    async deleteUserAlbumLikeHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { id: albumId } = request.params;

        await this._albumsService.getAlbumById(albumId);

        await this._userAlbumLikesService.unlikeAlbum(credentialId, albumId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil unlike albums',
        });
        response.code(200);
        return response;
    }
}

module.exports = UserAlbumLikesHandler;
