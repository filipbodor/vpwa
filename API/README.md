# API 

## Database setup

Create database and put needed parameters into the `.env` file:

```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
```

### Run migrations

```sh
node ace migration:run
```

### Seed database (for testing)

```sh
node ace db:seed
```

## Run

To run the project run this command:

```sh
npm run dev
```
