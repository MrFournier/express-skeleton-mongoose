express-skeleton-mongoose
=========================

Quick start Express skeleton app with tests and the Mongoose ODM.

# Development

Clone and install dependencies:

```
git clone https://github.com/RaphaelDeLaGhetto/express-skeleton-mongoose.git
cd express-skeleton-mongoose && npm install
```

Start a MongoDB development server:

```
docker run --name dev-mongo -p 27017:27017 -d mongo
```

Once created, you can start and stop the container like this:

```
docker stop dev-mongo
docker start dev-mongo
```

Seed database:

```
node seed.js
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

## Docker MongoDB

Create a data volume for MongoDB:                                                                                                                                                                         
```
docker create --name skeleton_mongo_data -v /dbdata mongo /bin/true
``` 

## docker-compose

You may need to run this twice:

```
docker-compose up
```

## Seed
#
#```
#docker-compose run --rm node node_modules/.bin/sequelize db:seed:all
#```
#
#What's the fastest way to reset the database? I've been running this:
#
#```
#node_modules/.bin/sequelize db:migrate:undo:all
#```

### Debug Mongo container

```
docker exec -it skeleton_mongo_1 mongo
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
cd ../express-skeleton-mongoose
docker-compose -f docker-compose.prod.yml up -d
```

## Create sessions table
#
#The default session storage mechanism is not meant for production. Hand this over to `postgres`:
#
#```
#docker exec -i expressskeletonmongoose_postgres_1 psql -U skeleton -d skeleton_production < node_modules/connect-pg-simple/table.sql
#```

## Seed
#
#```
#docker-compose run -e NODE_ENV=production --rm node node_modules/.bin/sequelize db:seed:all
#```

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


