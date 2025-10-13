# vpwa

## Install all dependencies (API + Quasar app)

From repo root:

```bash
# one-liner
(cd API && npm install) && (cd quasar-project && npm install)

# or use the helper script
bash ./install-all.sh
```

## Configure environment

Create `API/.env`:

```env
PORT=4000
JWT_SECRET=change-me

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=vpwa
```

Optional: `quasar-project/.env`:

```env
VITE_API_BASE=http://localhost:4000/api
```

## Run

In two terminals:

```bash
# Terminal 1: API
cd API
npm run migrate
npm run dev

# Terminal 2: Web
cd quasar-project
npm run dev
```