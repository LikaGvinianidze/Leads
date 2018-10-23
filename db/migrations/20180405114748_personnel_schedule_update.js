
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('personnel_schedule', (table) => {
    table.time('from').notNullable().alter();
    table.time('to').notNullable().alter();
  });
};

exports.down = function(knex, Promise) {
  
};
