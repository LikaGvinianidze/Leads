
exports.up = function(knex, Promise) {
  return knex.schema.createTable('personnel', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().notNullable();
    table.string('firstname').notNullable();
    table.string('lastname').notNullable();
    table.date('dateofbirth');
    table.string('email').unique();
    table.string('facebook');
    table.string('phone');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('organization_id').references('id').inTable('organizations');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('personnel');
};
