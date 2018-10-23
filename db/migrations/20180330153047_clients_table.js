
exports.up = function(knex, Promise) {
  return knex.schema.createTable('clients', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().notNullable();
    table.integer('source_id').unsigned().notNullable();
    table.string('firstname').notNullable();
    table.string('lastname').notNullable();
    table.enu('sex', ['male', 'female']);
    table.string('email').unique();
    table.string('phone');
    table.string('address');
    table.string('comment');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('organization_id').references('id').inTable('organizations');
    table.foreign('source_id').references('id').inTable('sources');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('clients');
};
