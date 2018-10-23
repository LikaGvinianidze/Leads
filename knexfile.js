'use strict';

const config = require('./config/config');

const knexConfig = {
  client: 'mysql',
  connection: {
    host : config.database.host,
    user : config.database.user,
    password : config.database.password,
    database : config.database.db
  },
  pool: {min: 0, max: 100},
  migrations: {
    directory: __dirname + '/db/migrations',
  },
  seeds: {
    directory: __dirname + '/db/seeds',
  }
};

module.exports = knexConfig;
