require("dotenv").config();
const path = require('path');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');


/**
 * Plugins Zone
 */
const songs = require("./api/songs");
const albums = require("./api/albums");
const playlists = require("./api/playlists");
const users = require("./api/users");
const authentications = require("./api/authentications");
const collaborations = require("./api/collaborations");

/**
 * Services Zone
 */
const SongsService = require("./services/postgres/SongsService");
const AlbumsService = require("./services/postgres/AlbumsService");
const PlaylistsService = require("./services/postgres/PlaylistsService");
const ActivitiesService = require("./services/postgres/ActivitiesService");
const UsersService = require("./services/postgres/UsersService");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const CollaborationsService = require("./services/postgres/CollaborationsService");

/**
 * Validators Zone
 */
const SongsValidator = require("./validator/songs");
const AlbumsValidator = require("./validator/albums");
const PlaylistValidator = require("./validator/playlists");
const UsersValidator = require("./validator/users");
const AuthenticationsValidator = require("./validator/authentications");
const CollaborationsValidator = require("./validator/collaborations");

//Exceptions
const ClientError = require("./exceptions/ClientError");

//token manager
const TokenManager = require("./tokenize/TokenManager");

// exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');


// uploads
const uploads = require("./api/uploads");
const StorageService = require("./services/storage/StorageService");
const UploadsValidator = require("./validator/uploads");

// user album likes
const userAlbumLikes = require("./api/userAlbumLikes");
const UserAlbumLikesService = require("./services/postgres/UserAlbumLikesService");

// cache
const CacheService = require("./services/redis/CacheService");

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const activitiesService = new ActivitiesService();
  const storageService = new StorageService(
    path.resolve(__dirname, "api/uploads/file/covers"),
  );
  const cacheService = new CacheService();
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        activitiesService,
        tokenManager: TokenManager,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        usersService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        storageService,
        albumsService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: userAlbumLikes,
      options: {
        userAlbumLikesService,
        albumsService,
      },
    },
  ]);

  // Error handling
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
