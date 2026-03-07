# Open Music API V3 - Perbaikan dan Verifikasi Lengkap

## Ringkasan Perubahan

Telah dilakukan pemeriksaan dan perbaikan komprehensif terhadap API untuk memastikan kesesuaian dengan test Postman. Berikut adalah detail perubahan:

### 1. Penambahan Kolom Cover URL untuk Album

**File: migrations/1772841028815_add-cover-url-to-albums.js (BARU)**
- Menambahkan kolom `cover_url` (TEXT, nullable) ke tabel `albums`
- Untuk menyimpan URL cover album

**Alasan:** Test Postman mengharapkan field `coverUrl` dalam response album detail

### 2. Update AlbumsService

**File: src/services/postgres/AlbumsService.js**
- Menambahkan method `editAlbumCover(id, coverUrl)`
- Method ini update kolom `cover_url` di tabel albums
- Digunakan oleh endpoint upload cover

**Alasan:** Handler upload membutuhkan method untuk menyimpan URL cover ke database

### 3. Update Utils Mapping

**File: src/utils/index.js**
- Update `mapDBToAlbumModel()` untuk include `coverUrl: cover_url`
- Update `mapDBAlbumsToModel()` untuk include `coverUrl: cover_url`
- Melakukan snake_case ke camelCase conversion

**Alasan:** Response API harus menggunakan camelCase sesuai convention dan Postman test expectations

### 4. Perbaikan Upload Handler

**File: src/api/uploads/handler.js**
- Menambahkan konversi header ke lowercase sebelum validation
- Memastikan header 'content-type' dalam format yang tepat untuk validator

**Alasan:** Hapi.js request payload headers mungkin menggunakan case yang berbeda

### 5. Update Upload Validator

**File: src/validator/uploads/schema.js**
- Menambahkan 'application/octet-stream' ke list valid MIME types
- Membuat field 'content-type' optional dengan fallback

**Alasan:** curl dan beberapa client HTTP mengirim 'application/octet-stream' untuk file uploads

## Verifikasi API

Semua endpoint telah diverifikasi dan berfungsi dengan baik:

### Albums ✓
- [x] GET /albums - Get all albums
- [x] POST /albums - Add album
- [x] GET /albums/{id} - Get album detail dengan songs
- [x] PUT /albums/{id} - Edit album
- [x] DELETE /albums/{id} - Delete album
- [x] POST /albums/{id}/covers - Upload cover
- [x] GET /albums/{id}/cover/{filename} - Get cover file
- [x] GET /albums/{id}/likes - Get album likes count
- [x] POST /albums/{id}/likes - Like album
- [x] DELETE /albums/{id}/likes - Unlike album

### Songs ✓
- [x] POST /songs - Add song
- [x] GET /songs - Get all songs
- [x] GET /songs/{id} - Get song detail
- [x] PUT /songs/{id} - Edit song
- [x] DELETE /songs/{id} - Delete song

### Users ✓
- [x] POST /users - Add user
- [x] GET /users/{id} - Get user by ID
- [x] GET /users - Get users by username

### Authentications ✓
- [x] POST /authentications - Login user
- [x] PUT /authentications - Refresh access token
- [x] DELETE /authentications - Logout (revoke refresh token)

### Playlists ✓
- [x] POST /playlists - Create playlist
- [x] GET /playlists - Get user playlists
- [x] DELETE /playlists/{id} - Delete playlist
- [x] POST /playlists/{id}/songs - Add song to playlist
- [x] GET /playlists/{id}/songs - Get playlist detail dengan songs
- [x] DELETE /playlists/{id}/songs - Remove song dari playlist
- [x] GET /playlists/{id}/activities - Get playlist activities/history

### Collaborations ✓
- [x] POST /playlists/{id}/collaborations - Add collaborator
- [x] DELETE /playlists/{id}/collaborations - Remove collaborator

### Exports ✓
- [x] POST /playlists/{id}/export - Queue playlist export

## Status Validasi

✓ Semua endpoints berfungsi
✓ Validasi payload bekerja dengan baik
✓ Error handling sesuai (400 untuk validation errors, 404 untuk not found)
✓ Authentication/Authorization working
✓ Database migrations applied successfully
✓ No lint/syntax errors
✓ Response structure sesuai Postman collection

## Migration Status

Database telah diupdate dengan successfully:
```
✓ 1759127984099_create-table-albums
✓ 1759127996409_create-table-songs
✓ 1767466830088_create-table-users
✓ 1772389978492_create-table-authentications
✓ 1772390173604_create-table-playlists
✓ 1772390196333_create-table-playlist-songs
✓ 1772390502319_create-table-playlist-song-activities
✓ 1772390543295_create-table-collaborations
✓ 1772841028814_create-table-user-album-likes
✓ 1772841028815_add-cover-url-to-albums
```

## Testing

Semua fitur telah ditest manual:
- User registration & login ✓
- Album CRUD operations ✓
- Song management ✓
- Playlist creation & management ✓
- Playlist activities tracking ✓
- Album likes with caching ✓
- File uploads (album covers) ✓
- Authentication & authorization ✓

API siap untuk diintegrasikan dengan client atau dijalankan dalam production.
