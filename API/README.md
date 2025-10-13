# VPWA API (Auth) with MySQL

## Setup

1. Create `.env` in this folder (see values):

```
PORT=4000
JWT_SECRET=change-me

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=vpwa
```

2. Install and run:

```bash
npm install
npm run dev
```

The server will create the database (if missing) and the `users` table.

## Routes
- POST `/api/auth/register` { name, email, password }
- POST `/api/auth/login` { email, password }
- GET `/api/auth/me` (Authorization: Bearer <token>)

## Notes
- Passwords are hashed with bcrypt.
- JWT expires in 7 days; stored on the client in localStorage.
