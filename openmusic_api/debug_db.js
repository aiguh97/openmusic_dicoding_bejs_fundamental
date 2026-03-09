require('dotenv').config();
const SongsService = require('./src/services/postgres/SongsService');

(async () => {
  const svc = new SongsService();
  try {
    const songs = await svc.getSongs();
    console.log('songs:', songs);
  } catch (err) {
    console.error('SongsService error:');
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
  }
})();
