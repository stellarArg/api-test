# SEED-BE. API

This is a RestAPI
The project use `knex` and `mongoose` as database connectors.
To run this project you should first first run `npm -g install knex` and then `npm install`
the creation of a "server" JSON API using a `PostgreSQL/MySql/SQLServer/MariaDB` or `Mongo` database, 
basic relation between `users` and `apps` 
the<br>
Project use `.env` to load config<br>
Use of `JSON Web Token` for manage session<br>
Use of gulp for running `test/eslint` and `build` the project<br>
Use of morgan for cli information<br>
Promise `async/await`<br>
Node version `>=12.14`<br>
To start the project u need to run `npm start`<br>
To start in development u need to run `npm run dev`<br>
To run lint test u need to run `npm run lint`<br>
To run migrations u need to run `npm run db:migrate`<br>
To run seed u need to run `npm run db:seed`

## Folder Structure
```
/db
  /migrations
  /seeds
/src
  /controllers -- business logic for handling API endpoints
  /helpers -- modules for common functions that sit outside controllers/models
  /models  -- simple collections of db queries and utilities for user data
    /postgres -- postgres models
  /routes -- defines API endpoints and passes requests to corresponding controllers
    /api -- api routes that need a valid authentication
    /middlewares -- main handler of routes validations
    /public-api -- the main public api all routers that not need authenticate should be here
    index.js -- the main Express app
  /services -- all business logic should be here
  /util -- functions that are often used should be here 
  `app.js` -- Main app creation, everything converge here. the load of `mongoose`, `middlewares` u need and pre config for the express openapi
knexfile.js -- defines connection for SQL databases only used for migrations run.
package.json -- defines scripts for utilities like migrations and seeds
.env -- Needed for database,port and email
```

## .env Structure

#### NODE_ENV -- The type of project u are using one of those are needed development,production
```
example `NODE_ENV=development`
```
#### MONGO_URL -- mongo connection string
```
example MONGO_URL=mongodb://user:password@ip:port/database
```
#### PAGE_SIZE -- max size for api response
```
example
PAGE_SIZE=50
```

#### DB_DRIVER -- Which SQL u need to use
#### DB_CONFIG -- Connection config
```
Example
DB_DRIVER=postgres
DB_CONFIG='{"driver": "pg", "database": "xxxx", "user": "xxxxx", "password": "xxxxx", "port": 5432}'
```

## Knex

Why Knex. Knex its  a SQL query builder, that its simple to use.
But it also comes with some handy CLI tools for running migrations and seeding
your database (along with connecting to it in the first place from within your
app).


## License
MIT

##### @indec-it
