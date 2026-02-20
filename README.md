# Kodbank – Full-Stack Banking Application

A production-ready banking web application built with React, Node.js, Express, MySQL (Aiven) and Prisma ORM.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite, TailwindCSS, Framer Motion, Axios |
| Backend    | Node.js, Express 4                      |
| Database   | MySQL hosted on **Aiven**               |
| ORM        | Prisma 5                                |
| Auth       | JWT (HS256) + HTTP-only cookies         |
| Security   | bcrypt (12 rounds), rate-limiting, CORS, input validation |

---

## Quick Start

### 1 · Clone

```bash
git clone <repo-url>
cd kodbanking
```

### 2 · Backend setup

```bash
cd server
npm install

# Copy and fill in your Aiven credentials
cp .env.example .env
# Edit server/.env with your DATABASE_URL and JWT_SECRET

# Push schema to Aiven MySQL
npx prisma db push
# or run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

### 3 · Frontend setup

```bash
cd ../client
npm install

# Copy env
cp .env.example .env
# VITE_API_URL defaults to /api (proxied) – no change needed for local dev

# Start dev server
npm run dev
```

App runs at: **http://localhost:5173**  
API runs at: **http://localhost:5000**

---

## Environment Variables

### server/.env

```env
DATABASE_URL="mysql://avnadmin:PASSWORD@mysql-host.aivencloud.com:PORT/kodbank?sslaccept=strict"
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_chars
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### client/.env (production)

```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## API Endpoints

| Method | Path                    | Auth | Description              |
|--------|-------------------------|------|--------------------------|
| POST   | /api/auth/register      | ❌   | Create account           |
| POST   | /api/auth/login         | ❌   | Login, set cookie        |
| POST   | /api/auth/logout        | ✅   | Clear session            |
| GET    | /api/auth/me            | ✅   | Verify session           |
| GET    | /api/account/balance    | ✅   | Fetch account balance    |
| GET    | /health                 | ❌   | Health check             |

---

## Database Schema

```
users
  id            UUID PK
  name          VARCHAR(100)
  email         VARCHAR(150) UNIQUE
  phone         VARCHAR(20)
  role          VARCHAR(20) DEFAULT 'customer'
  password_hash VARCHAR(255)
  balance       DECIMAL(15,2) DEFAULT 100000.00
  created_at    DATETIME

user_tokens
  id         INT PK AUTO_INCREMENT
  user_id    UUID FK → users.id
  token      TEXT
  created_at DATETIME
  expires_at DATETIME
```

---

## Security Features

- ✅ bcrypt password hashing (12 salt rounds)
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Secure + SameSite=Strict cookie flags in production
- ✅ Token stored in DB, revocable on logout
- ✅ Login rate limiting (10 req / 15 min per IP)
- ✅ Input validation via express-validator
- ✅ Aiven MySQL SSL connection (`sslaccept=strict`)
- ✅ CORS with credentials only from allowed origins
- ✅ Centralized error handling (no stack traces in production)
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)

---

## Deployment

### Backend → Railway / Render

1. Set all environment variables from `server/.env`
2. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
3. Start command: `npm start`

### Frontend → Vercel

1. Set `VITE_API_URL` to your backend URL
2. Build command: `npm run build`
3. Output directory: `dist`
