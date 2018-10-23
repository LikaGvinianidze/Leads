
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('organizations', (table) => {
    table.datetime('deleted').after('info');
  });
};

exports.down = function(knex, Promise) {
  
};
