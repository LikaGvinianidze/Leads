
exports.up = function(knex, Promise) {
  return knex.schema.createTable('personnel_schedule', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().notNullable();
    table.integer('personnel_id').unsigned().notNullable();
    table.string('day').notNullable();
    table.dateTime('from').notNullable();
    table.dateTime('to').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('organization_id').references('id').inTable('organizations');
    table.foreign('personnel_id').references('id').inTable('personnel');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('personnel_schedule');
};
