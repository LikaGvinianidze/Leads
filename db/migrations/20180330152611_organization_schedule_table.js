
exports.up = function(knex, Promise) {
  return knex.schema.createTable('organization_schedule', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().notNullable();
    table.specificType('day', 'tinyint(1)').notNullable();
    table.time('from').notNullable();
    table.time('to').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('organization_id').references('id').inTable('organizations');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('organization_schedule');
};
