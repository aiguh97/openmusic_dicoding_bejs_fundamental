const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * CollaborationsService is a service that handles the collaboration between users
 */
class CollaborationsService {
    constructor() {
        this._pool = new Pool();
    }

    /**
     * addCollaboration is a function to add collaboration between users
     */
    async addCollaboration(playlistId, userId) {
        const id = `collaboration-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('Gagal menambahkan kolaborasi');
        }

        return result.rows[0].id;
    }

    /**
     * deleteCollaboration is a function to delete collaboration between users
     */
    async deleteCollaboration(playlistId, userId) {
        const query = {
            text: `DELETE FROM collaborations 
        WHERE playlist_id = $1 AND user_id = $2
        RETURNING id`,
            values: [playlistId, userId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('Gagal menghapus kolaborasi');
        }
    }

    /**
     * verifyCollaborator is a function to verify if the user is a collaborator
     */
    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: `SELECT * FROM collaborations 
        WHERE user_id = $1 AND playlist_id = $2`,
            values: [userId, playlistId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('Tidak memiliki kolaborasi');
        }
    }
}

module.exports = CollaborationsService;