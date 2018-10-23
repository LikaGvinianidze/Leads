
exports.up = function(knex, Promise) {
  return knex.schema.createTable('organization_packets', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().notNullable();
    table.integer('packet_id').unsigned().notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('organization_id').references('id').inTable('organizations');
    table.foreign('packet_id').references('id').inTable('packets');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('organization_packets');
};
