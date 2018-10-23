
exports.up = function(knex, Promise) {
  return knex.schema.createTable('bookings', (table) => {
    table.increments('id').primary();
    table.integer('organization_id').unsigned().notNullable();
    table.integer('client_id').unsigned().notNullable();
    table.integer('personnel_id').unsigned().notNullable();
    table.integer('service_id').unsigned().notNullable();
    table.enu('status', ['active', 'canceled', 'finished']).notNullable();
    table.dateTime('start_time').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('organization_id').references('id').inTable('organizations');
    table.foreign('client_id').references('id').inTable('clients');
    table.foreign('personnel_id').references('id').inTable('personnel');
    table.foreign('service_id').references('id').inTable('services');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('bookings');
};
