# CHECKLIST VERIFIKASI OPENMUSIC API V3

## KRITERIA 1: Ekspor Lagu Pada Playlist ✓

### Requirement:
- [x] Route: POST /export/playlists/{playlistId}
- [x] Body: { "targetEmail": string }
- [x] Gunakan RabbitMQ
- [x] RABBITMQ_SERVER environment variable
- [x] Hanya pemilik playlist yang boleh (auth check)
- [x] Data: playlistId dan targetEmail saja
- [x] Kirim program consumer
- [x] Hasil JSON
- [x] Email via nodemailer
- [x] Environment variables: SMTP_USER, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT
- [x] Response: 201 dengan message "Permintaan Anda sedang kami proses"

### Implementation:
- ExportsHandler: `/src/api/exports/handler.js` ✓
- ExportsRoutes: `/src/api/exports/routes.js` ✓
- ProducerService: `/src/services/rabbitmq/ProducerService.js` ✓
- ConsumerService: `/consumer.js` (BARU) ✓
- ExportsValidator: `/src/validator/exports/schema.js` ✓
- Script: `npm run consumer` ✓

---

## KRITERIA 2: Mengunggah Sampul Album ✓

### Requirement:
- [x] Route: POST /albums/{id}/covers
- [x] MIME type validation (images)
- [x] Max size: 512000 bytes
- [x] File System storage (local)
- [x] Response: 201
- [x] GET /albums/{id} include coverUrl
- [x] coverUrl accessible
- [x] coverUrl null jika tidak ada
- [x] Replace sampul lama

### Implementation:
- UploadsHandler: `/src/api/uploads/handler.js` ✓
- UploadsRoutes: `/src/api/uploads/routes.js` ✓
  - maxBytes: 512 * 1000 ✓
- UploadsValidator: `/src/validator/uploads/schema.js` ✓
- StorageService: `/src/services/storage/StorageService.js` ✓
- AlbumsService: `editAlbumCover()` method ✓
- Migration: `1772841028815_add-cover-url-to-albums.js` ✓
- Utils: `mapDBAlbumsToModel()` include coverUrl ✓

---

## KRITERIA 3: Menyukai Album ✓

### Requirement:
- [x] POST /albums/{id}/likes (like album, authenticated)
- [x] GET /albums/{id}/likes (get count, public)
- [x] DELETE /albums/{id}/likes (unlike, authenticated)
- [x] User hanya bisa like 1x
- [x] Return 400 jika duplicate like

### Implementation:
- UserAlbumLikesHandler: `/src/api/userAlbumLikes/handler.js` ✓
- UserAlbumLikesRoutes: `/src/api/userAlbumLikes/routes.js` ✓
  - POST: authenticated ✓
  - GET: public ✓
  - DELETE: authenticated ✓
- UserAlbumLikesService: `/src/services/postgres/UserAlbumLikesService.js` ✓
  - verifyAlbumLike() check ✓
  - Error 400 untuk duplicate ✓
  - Cache invalidation on like/unlike ✓
- Migration: `1772841028814_create-table-user-album-likes.js` ✓
  - Foreign keys: user_id, album_id ✓
  - Cascade delete ✓

---

## KRITERIA 4: Server-Side Cache ✓

### Requirement:
- [x] Cache untuk GET /albums/{id}/likes
- [x] Cache berlaku 30 menit (1800 detik)
- [x] Response header: X-Data-Source: "cache"
- [x] Hapus cache saat like/unlike album
- [x] Gunakan Redis
- [x] REDIS_SERVER environment variable
- [x] Socket connection

### Implementation:
- CacheService: `/src/services/redis/CacheService.js` ✓
  - Socket connection: `socket: { host: process.env.REDIS_SERVER }` ✓
  - Cache expiration: 1800 seconds (30 menit) ✓
- UserAlbumLikesHandler: 
  - X-Data-Source header ✓
  - Cache invalidation on like/unlike ✓
- UserAlbumLikesService:
  - Cache get/set/delete ✓

---

## KRITERIA 5: Maintain V1 & V2 Features ✓

### Album Management
- [x] CRUD: POST, GET, PUT, DELETE
- [x] Validation
- [x] Error handling
- [x] Foreign keys (NULL untuk optional fields)

### Song Management
- [x] CRUD: POST, GET, PUT, DELETE
- [x] Query filters (title, performer)
- [x] Foreign key: album_id
- [x] Validation
- [x] Error handling

### User Registration & Authentication
- [x] User registration (POST /users)
- [x] User login (POST /authentications)
- [x] Token refresh (PUT /authentications)
- [x] Logout (DELETE /authentications)
- [x] Password encryption (bcrypt)
- [x] JWT tokens
- [x] Validation

### Playlist Management
- [x] Create playlist (POST /playlists)
- [x] Get user playlists (GET /playlists)
- [x] Delete playlist (DELETE /playlists/{id})
- [x] Add song to playlist (POST /playlists/{id}/songs)
- [x] Get playlist with songs (GET /playlists/{id}/songs)
- [x] Remove song from playlist (DELETE /playlists/{id}/songs)
- [x] Get playlist activities (GET /playlists/{id}/activities)

### Foreign Keys & Cascades
- [x] albums table: -
- [x] songs table: album_id (cascade delete)
- [x] users table: -
- [x] playlists table: owner_id (user_id, cascade delete)
- [x] playlist_songs table: playlist_id, song_id (cascade delete)
- [x] playlist_song_activities table: playlist_id, song_id (cascade delete)
- [x] user_album_likes table: user_id, album_id (cascade delete)
- [x] authentications table: user_id
- [x] collaborations table: playlist_id, user_id (cascade delete)

### Validation
- [x] Joi schemas untuk semua payload
- [x] Email validation
- [x] URL validation
- [x] Type checking
- [x] Required fields

### Error Handling
- [x] 400 Bad Request (validation errors)
- [x] 404 Not Found
- [x] 401 Unauthorized (auth required)
- [x] 403 Forbidden (authorization check)
- [x] 201 Created (POST endpoints)
- [x] 200 OK (GET/PUT/DELETE successful)

---

## Environment Variables Checklist ✓

Required:
- [x] HOST
- [x] PORT
- [x] PGUSER
- [x] PGHOST
- [x] PGPASSWORD
- [x] PGDATABASE
- [x] PGPORT
- [x] ACCESS_TOKEN_KEY
- [x] REFRESH_TOKEN_KEY
- [x] ACCESS_TOKEN_AGE
- [x] RABBITMQ_SERVER (NEW)
- [x] REDIS_SERVER (NEW)
- [x] SMTP_HOST (NEW)
- [x] SMTP_PORT (NEW)
- [x] SMTP_USER (NEW)
- [x] SMTP_PASSWORD (NEW)

All documented in `.env.example` ✓

---

## Dependencies ✓

Installed:
- [x] @hapi/hapi (framework)
- [x] @hapi/inert (static files)
- [x] @hapi/jwt (authentication)
- [x] amqplib (RabbitMQ)
- [x] bcrypt (password hashing)
- [x] pg (database)
- [x] redis (caching)
- [x] joi (validation)
- [x] nanoid (ID generation)
- [x] nodemailer (NEW - email)

---

## Code Quality ✓

- [x] No ESLint errors
- [x] No syntax errors
- [x] Consistent code style
- [x] Proper error handling
- [x] Auto-bind usage
- [x] Comments on main functions

---

## NPM Scripts ✓

```json
{
  "start": "node ./src/server.js",
  "start-prod": "NODE_ENV=production node ./src/server.js",
  "start-dev": "nodemon ./src/server.js",
  "lint": "eslint ./src",
  "consumer": "node ./consumer.js",
  "migrate": "node-pg-migrate",
  "migrate:create": "node-pg-migrate create",
  "migrate:up": "node-pg-migrate up",
  "migrate:down": "node-pg-migrate down"
}
```

---

## Database Migrations - ALL APPLIED ✓

1. [x] 1759127984099_create-table-albums.js
2. [x] 1759127996409_create-table-songs.js
3. [x] 1767466830088_create-table-users.js
4. [x] 1772389978492_create-table-authentications.js
5. [x] 1772390173604_create-table-playlists.js
6. [x] 1772390196333_create-table-playlist-songs.js
7. [x] 1772390502319_create-table-playlist-song-activities.js
8. [x] 1772390543295_create-table-collaborations.js
9. [x] 1772841028814_create-table-user-album-likes.js
10. [x] 1772841028815_add-cover-url-to-albums.js

---

## HASIL VERIFIKASI FINAL

### Status: ✓ SEMUA KRITERIA TERPENUHI

**Kriteria 1 (Ekspor Playlist):** LENGKAP
- Producer: ✓
- Consumer: ✓ (BARU)
- RabbitMQ Integration: ✓
- Email Integration: ✓
- Response Format: ✓

**Kriteria 2 (Upload Sampul):** LENGKAP
- Upload Handler: ✓
- File Storage: ✓
- Size Validation (512KB): ✓
- Database Storage: ✓
- API Response: ✓

**Kriteria 3 (Album Likes):** LENGKAP
- Like Album: ✓
- Unlike Album: ✓
- Get Count: ✓
- Duplicate Prevention: ✓
- Authentication: ✓

**Kriteria 4 (Server Cache):** LENGKAP
- Redis Integration: ✓
- Cache Set/Get/Delete: ✓
- 30-minute Expiration: ✓
- X-Data-Source Header: ✓
- Cache Invalidation: ✓

**Kriteria 5 (V1 & V2 Features):** LENGKAP
- Albums: ✓
- Songs: ✓
- Users: ✓
- Auth: ✓
- Playlists: ✓
- Foreign Keys: ✓
- Validation: ✓
- Error Handling: ✓

---

## PETUNJUK SETUP & TESTING

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env dengan kredensial Anda
```

### 3. Run Migrations
```bash
npm run migrate:up
```

### 4. Start Server
```bash
npm run start-dev
```

### 5. Start Consumer (di terminal terpisah)
```bash
npm run consumer
```

### 6. Test dengan Postman
- Gunakan file: `Open Music API V3 Test.postman_collection.json`
- Gunakan environment: `OpenMusic API Test.postman_environment.json`

---

## CATATAN PENTING

✓ API fully functional dan siap production
✓ Semua 5 kriteria terpenuhi
✓ Semua database migrations applied
✓ Error handling proper
✓ Code quality good
✓ Ready untuk reviewer

