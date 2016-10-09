
# Development

## Docker Postgres

This is mostly intended for development and testing:

```
docker run --name accountant-postgres -e POSTGRES_USER=accountant -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres
```

## Create the database

`sequelize-cli` doesn't appear to have a _create database_ task:

```
docker exec -u postgres -it accountant-postgres psql -c "create role accountant with createdb login password 'secret';"
docker exec -u postgres -it accountant-postgres psql -c "create database accountant_development with owner=accountant;"
```

## Migrate and seed

```
node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all
```

What's the fastest way to reset the database? I've been running this:

```
node_modules/.bin/sequelize db:migrate:undo:all
```


### Debug Postgres container

```
docker exec -it accountant-postgres bash
> psql -U accountant
```

## Execute

```
DEBUG=accountant:* & npm start
```

# Testing

## Docker Postgres

As in development, make sure that a `postgres` `docker` container is up and running:

```
docker run --name accountant-postgres -e POSTGRES_USER=accountant -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres
```

## Create the database

This was probably executed when setting up the dev environment. If it's already been executed, it doesn't need to be executed again:

```
docker exec -u postgres -it accountant-postgres psql -c "create role accountant with createdb login password 'secret';"
```

Create the _test_ database:

```
docker exec -u postgres -it accountant-postgres psql -c "create database accountant_test with owner=accountant;"
```

Migrate:

I actually might not need this. The `#sync` method should recreate tables on every test run:

```
NODE_ENV=test node_modules/.bin/sequelize db:migrate
```

