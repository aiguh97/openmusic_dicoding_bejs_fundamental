const autoBind = require('auto-bind');

/**
 * SongsHandler is a class that will be used to handle all of the routes
 */
class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    /**
     * postSongHandler is a method that will be used to handle the POST request to add a song
     */
    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        // eslint-disable-next-line object-curly-newline
        const { title, year, genre, performer, duration, albumId } = request.payload;

        const songId = await this._service.addSong({
            title,
            year,
            genre,
            performer,
            duration,
            albumId,
        });

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    }

    /**
     * getSongsHandler is a method that will be used to handle the GET request to get all songs
     */
    async getSongsHandler(request) {
        const { title, performer } = request.query;
        const songs = await this._service.getSongs(title, performer);

        return {
            status: 'success',
            data: {
                songs: songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer,
                })),
            },
        };
    }

    /**
     * getSongByIdHandler is a method that will be used to handle the GET request
     * to get a song by id
     */
    async getSongByIdHandler(request) {
        const { id } = request.params;
        const song = await this._service.getSongById(id);
        return {
            status: 'success',
            data: {
                song,
            },
        };
    }

    /**
     * putSongByIdHandler is a method that will be used to handle the PUT request
     * to edit a song by id
     */
    async putSongByIdHandler(request) {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;

        await this._service.editSongById(id, request.payload);

        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui',
        };
    }

    /**
     * deleteSongByIdHandler is a method that will be used to handle the DELETE request
     * to delete a song by id
     */
    async deleteSongByIdHandler(request) {
        const { id } = request.params;
        await this._service.deleteSongById(id);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}

module.exports = SongsHandler;