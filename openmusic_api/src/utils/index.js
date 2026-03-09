/* eslint-disable camelcase */

// Album basic
const mapDBToAlbumModel = ({ id, name, year, cover_url, created_at, updated_at }) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
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
const mapDBAlbumsToModel = ({ id, name, year, cover_url, songs }) => ({
  id,
  name,
  year,
  coverUrl: cover_url,
  songs,
});

module.exports = {
  mapDBToAlbumModel,
  mapDBToSongModel,
  mapDBSongsToModel,
  mapDBSongsToModelDetail,
  mapDBAlbumsToModel,
};