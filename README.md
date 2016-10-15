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
docker create --name skeleton_data -v /dbdata postgres /bin/true
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
docker exec -it skeleton_postgres_1 bash
> psql -d skeleton_staging -U skeleton
```

# Production

Set this up behind an `nginx`/`jrcs/letsencrypt-nginx-proxy-companion` combo. Create a new directory just for this combo:

```
mkdir nginx-proxy && cd nginx-proxy
```

Copy and paste the following to a `docker-compose.yml` file:

```
nginx-proxy:
  image: jwilder/nginx-proxy
  restart: always
  ports:
    - "80:80"
    - "443:443"
  volumes:                     
    - ./current/public:/usr/share/nginx/html
    - ./certs:/etc/nginx/certs:ro
    - /etc/nginx/vhost.d
    - /usr/share/nginx/html
    - /var/run/docker.sock:/tmp/docker.sock:ro
letsencrypt:
  image: jrcs/letsencrypt-nginx-proxy-companion
  restart: always
  volumes:
    - ./certs:/etc/nginx/certs:rw
    - /var/run/docker.sock:/var/run/docker.sock:ro
  volumes_from:
    - nginx-proxy
```

Then, from the project directory:

```
cd ../express-skeleton
docker-compose -f docker-compose.prod.yml up -d
```

## Create sessions table

The default session storage mechanism is not meant for production. Hand this over to `postgres`:

```
docker exec -i expressskeleton_postgres_1 psql -U skeleton -d skeleton_production < node_modules/connect-pg-simple/table.sql
```

## Seed

```
docker-compose run -e NODE_ENV=production --rm node node_modules/.bin/sequelize db:seed:all
```

## General Docker debugging

[Docker sometimes uses up all the `inodes`](https://github.com/docker/docker/issues/10613). This happened to me while working out the production deployment kinks.

Remove stopped containers:

```
docker rm $(docker ps -a -q)
```

Remove dangling images:

```
docker rmi $(docker images -q --filter "dangling=true")
```


