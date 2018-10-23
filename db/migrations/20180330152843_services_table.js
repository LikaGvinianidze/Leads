
exports.up = function(knex, Promise) {
  return knex.schema.createTable('services', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().notNullable();
    table.string('name').notNullable();
    table.string('description');
    table.integer('cost').notNullable();
    table.integer('duration').notNullable();
    table.json('sex').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('organization_id').references('id').inTable('organizations');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('services');
};
