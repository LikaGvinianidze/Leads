
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('organizations', (table) => {
    table.datetime('last_payment_date').nullable().after('info');
  })
};

exports.down = function(knex, Promise) {
  
};
