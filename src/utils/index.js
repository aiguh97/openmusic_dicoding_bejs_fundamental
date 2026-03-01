/* eslint-disable camelcase */

// Album basic
const mapDBToAlbumModel = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

// Song basic
const mapDBToSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  created_at,
  updated_at,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

// Song list (untuk GET /songs)
const mapDBSongsToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

// Song detail
const mapDBSongsToModelDetail = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

// Album detail
const mapDBAlbumsToModel = ({ id, name, year, songs }) => ({
  id,
  name,
  year,
  songs,
});

module.exports = {
  mapDBToAlbumModel,
  mapDBToSongModel,
  mapDBSongsToModel,
  mapDBSongsToModelDetail,
  mapDBAlbumsToModel,
};