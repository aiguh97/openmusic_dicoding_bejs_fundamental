const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

/**
 * UserAlbumLikesService is a service class that handles user album likes data
 */
class UserAlbumLikesService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    /**
     * likeAlbum adds user and album id to user_album_likes table
     */
    async likeAlbum(userId, albumId) {
        const id = `user-album-like${nanoid(16)}`;

        // eslint-disable-next-line max-len
        const alreadyLike = await this.verifyAlbumLike(userId, albumId);
        if (alreadyLike) {
            throw new ClientError('Album sudah dilike sebelumnya');
        }

        const query = {
            text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3)',
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('User gagal like album');
        }

        await this._cacheService.delete(`album-like:${albumId}`);
    }

    /**
     * unlikeAlbum removes user and album id from user_album_likes table
     */
    async unlikeAlbum(userId, albumId) {
        // eslint-disable-next-line max-len
        const alreadyLike = await this.verifyAlbumLike(userId, albumId);
        if (!alreadyLike) {
            throw new ClientError('Album belum dilike sebelumnya');
        }

        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('User gagal unlike album');
        }

        await this._cacheService.delete(`album-like:${albumId}`);
    }

    /**
     * getAlbumLikes returns sum of user likes for an album
     */
    async getAlbumLikes(albumId) {
        try {
            const result = await this._cacheService.get(`album-like:${albumId}`);
            return {
                likes: JSON.parse(result),
                from: 'cache',
            };
        } catch {
            const query = {
                text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
                values: [albumId],
            };

            const result = await this._pool.query(query);

            await this._cacheService.set(`album-like:${albumId}`, JSON.stringify(result.rowCount), 1800);
            return {
                likes: result.rowCount,
            };
        }
    }

    /**
     * verifyAlbumLike checks if user has liked an album
     */
    async verifyAlbumLike(userId, albumId) {
        const query = {
            text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);
        const like = result.rowCount;

        return like;
    }
}

module.exports = UserAlbumLikesService;
