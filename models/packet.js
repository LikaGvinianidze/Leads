const knex = require('../db/knex');

module.exports = {

  get() {
    return knex.select('*')
      .from('packets')
      .where(knex.raw('deleted_at is null'));
  }
};