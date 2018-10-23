
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('personnel_schedule', (table) => {
    table.specificType('day', 'tinyint(1)').notNullable().alter();
  })
};

exports.down = function(knex, Promise) {
  
};
