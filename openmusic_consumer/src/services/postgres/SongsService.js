const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToSongModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

/**
 * SongsService is a class that will be used to handle all of the CRUD operations on songs data
 */
class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  /**
   * addSong is a method that will be used to handle the POST request to add a song
   */
  // eslint-disable-next-line object-curly-newline
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date();
    const updatedAt = createdAt;

    const query = {
      text: `
      INSERT INTO songs (
        id,
        title,
        year,
        genre,
        performer,
        duration,
        created_at,
        updated_at,
        album_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `,
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        createdAt,
        updatedAt,
        albumId || null,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  /**
   * getSongs is a method that will be used to handle the GET request to get all songs
   */
  async getSongs(title, performer) {
    let query = "";
    if (title && performer) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2",
        values: [`%${title.toLowerCase()}%`, `%${performer.toLowerCase()}%`],
      };
    } else if (title) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1",
        values: [`%${title.toLowerCase()}%`],
      };
    } else if (performer) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE $1",
        values: [`%${performer.toLowerCase()}%`],
      };
    } else {
      query = "SELECT id, title, performer FROM songs";
    }

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToSongModel);
  }

  /**
   * getSongById is a method that will be used to handle the GET request
   * to get a song by its id
   */
  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows.map(mapDBToSongModel)[0];
  }

  /**
   * editSongById is a method that will be used to handle the PUT request
   * to edit a song by its id
   */
  // eslint-disable-next-line object-curly-newline
  async editSongById(id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id",
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }

  /**
   * deleteSongById is a method that will be used to handle the DELETE request
   * to delete a song by its id
   */
  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }
  }

  /**
   * verifySong is a method that will be used to verify a song
   */
  async verifySong(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak valid");
    }
  }
}

module.exports = SongsService;
