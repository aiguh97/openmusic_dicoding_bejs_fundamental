# QUICK START GUIDE - OpenMusic API V3

## 🚀 5 MENIT SETUP

### Step 1: Install Dependencies (30 detik)
```bash
npm install
```

### Step 2: Setup Environment (1 menit)
```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dengan kredential DB Anda:
nano .env
```

**Minimal .env:**
```env
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=your-password
PGDATABASE=openmusic
PGPORT=5432

HOST=localhost
PORT=5000

ACCESS_TOKEN_KEY=secret-key-1
REFRESH_TOKEN_KEY=secret-key-2
```

### Step 3: Database (1 menit)
```bash
# Create database
createdb openmusic

# Run migrations
npm run migrate:up
```

### Step 4: Start Server (1 menit)
```bash
# Terminal 1
npm run start
# Server running at http://localhost:5000
```

### Step 5: Test API (1 menit)
```bash
# Terminal 2 - Test basic endpoint
curl http://localhost:5000/albums

# Expect:
{
  "status": "success",
  "data": {
    "albums": []
  }
}
```

---

## 📋 OPTIONAL: FULL FEATURES (RabbitMQ + Redis + Email)

Hanya perlu jika ingin test Kriteria 1 & 4:

### RabbitMQ Setup
```bash
# macOS (using Homebrew)
brew install rabbitmq

# Start RabbitMQ
brew services start rabbitmq

# Check localhost:15672 (admin panel)
```

### Redis Setup
```bash
# macOS
brew install redis

# Start Redis
brew services start redis

# Test
redis-cli ping
# Expect: PONG
```

### Email Setup (untuk Kriteria 1)
```bash
# Edit .env tambah:
RABBITMQ_SERVER=amqp://localhost
REDIS_SERVER=localhost

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Start Consumer (Terminal 3)
```bash
npm run consumer
# Listening for export:playlists queue
```

---

## ✅ VERIFY INSTALLATION

### Check 1: Server Running
```bash
curl -s http://localhost:5000/albums | jq '.status'
# Expect: "success"
```

### Check 2: Database Connected
```bash
curl -s http://localhost:5000/albums | jq '.data.albums'
# Expect: [] (empty array)
```

### Check 3: Redis Connected (Optional)
```bash
redis-cli
127.0.0.1:6379> ping
# Expect: PONG
```

### Check 4: RabbitMQ Connected (Optional)
```bash
# Browse to http://localhost:15672
# Username: guest
# Password: guest
```

---

## 🧪 QUICK TEST ENDPOINTS

### 1. Register User
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "fullname": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
# Copy accessToken dari response
```

### 3. Create Album
```bash
curl -X POST http://localhost:5000/albums \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My Album",
    "year": 2024
  }'
# Copy album id dari response
```

### 4. Add Song to Album
```bash
curl -X POST http://localhost:5000/songs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Song Title",
    "year": 2024,
    "genre": "Pop",
    "performer": "Artist Name",
    "duration": 240,
    "albumId": "ALBUM_ID_HERE"
  }'
```

### 5. Like Album (Kriteria 3)
```bash
curl -X POST http://localhost:5000/albums/ALBUM_ID/likes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Album Likes (Kriteria 4 - Check X-Data-Source header)
```bash
curl -i http://localhost:5000/albums/ALBUM_ID/likes
# Header X-Data-Source: cache (pada request kedua dalam 30 menit)
```

---

## 📁 PROJECT STRUCTURE

```
openmusic_api/
├── src/
│   ├── server.js              # Main server
│   ├── api/                   # Route handlers
│   │   ├── albums/
│   │   ├── songs/
│   │   ├── users/
│   │   ├── authentications/
│   │   ├── playlists/
│   │   ├── collaborations/
│   │   ├── exports/           # Export handler (Kriteria 1)
│   │   ├── uploads/           # Upload handler (Kriteria 2)
│   │   └── userAlbumLikes/    # Likes handler (Kriteria 3)
│   ├── services/
│   │   ├── postgres/          # Database services
│   │   ├── rabbitmq/          # Message broker (Kriteria 1)
│   │   ├── redis/             # Cache (Kriteria 4)
│   │   └── storage/           # File storage (Kriteria 2)
│   ├── validator/             # Joi validation schemas
│   ├── exceptions/            # Custom error classes
│   ├── tokenize/              # JWT handling
│   └── utils/                 # Helper functions
├── migrations/                # Database migrations (10 total)
├── consumer.js                # Export consumer (Kriteria 1) ⭐
├── package.json               # Dependencies
├── .env.example               # Environment template
└── node-pg-migrate.config.js  # Migration config
```

---

## 🐛 TROUBLESHOOTING

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
→ PostgreSQL tidak running. Start dengan: `brew services start postgresql`

### Error: "Cannot find module 'nodemailer'"
→ Run: `npm install`

### Error: "Port 5000 already in use"
→ Change PORT di .env atau kill process: `lsof -ti:5000 | xargs kill -9`

### Error: "ENOENT: no such file or directory 'uploads/'"
→ Folder uploads akan auto-created pada upload pertama

### Redis: "connect ECONNREFUSED"
→ Start Redis: `brew services start redis`

### RabbitMQ: "connect ECONNREFUSED"
→ Start RabbitMQ: `brew services start rabbitmq`

---

## 📚 DOKUMENTASI LENGKAP

- **README_FINAL.md** - Laporan final & verifikasi semua kriteria
- **CHECKLIST_VERIFIKASI_V3.md** - Checklist detail setiap kriteria
- **PERBAIKAN_DAN_VERIFIKASI.md** - Dokumentasi perbaikan sebelumnya
- **Open Music API V3 Test.postman_collection.json** - Postman test automation

---

## 🎯 NEXT STEPS

1. ✅ Setup database & server
2. ✅ Test basic endpoints
3. ✅ Setup RabbitMQ & Redis (optional, untuk full features)
4. ✅ Setup SMTP email (untuk receiving export files)
5. ✅ Run Postman collection tests
6. ✅ Deploy to production

---

**Last Updated:** March 7, 2025  
**Status:** Ready for Production ✅

