const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * AuthenticationsService is a class that will be used to handle all of the authentication services
 */
class AuthenticationsService {
    constructor() {
        this._pool = new Pool();
    }

    /**
     * addRefreshToken is a method that will be used to add a refresh token to the database
     */
    async addRefreshToken(token) {
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        };

        await this._pool.query(query);
    }

    /**
     * verifyRefreshToken is a method that will be used to verify the refresh token
     */
    async verifyRefreshToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid');
        }
    }

    /**
     * deleteRefreshToken is a method that will be used to delete the refresh token
     */
    async deleteRefreshToken(token) {
        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token],
        };

        await this._pool.query(query);
    }
}

module.exports = AuthenticationsService;