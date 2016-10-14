express-skeleton
================

Quick start Express skeleton app with tests.

# Development

Clone and install dependencies:

```
git clone https://github.com/RaphaelDeLaGhetto/express-skeleton.git
cd express-skeleton && npm install
```

Seed database:

```
node_modules/.bin/sequelize db:seed:all
```

Run server:

```
npm start
```

# Testing

I use `jasmine` and `zombie` for testing. These are included in the package's development dependencies.

Run the tests:

```
npm test
```

# Staging

## Docker Postgres

Create a data volume for PostgreSQL:                                                                                                                                                                         
```
docker create --name accountant_data -v /dbdata postgres /bin/true
``` 

## docker-compose

You may need to run this twice:

```
docker-compose up
```

## Seed

```
docker-compose run --rm node node_modules/.bin/sequelize db:seed:all
```

What's the fastest way to reset the database? I've been running this:

```
node_modules/.bin/sequelize db:migrate:undo:all
```

### Debug Postgres container

```
docker exec -it accountant_postgres_1 bash
> psql -d accountant_staging -U accountant
```

# Production

Coming soon...

