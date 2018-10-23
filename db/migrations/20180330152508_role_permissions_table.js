
exports.up = function(knex, Promise) {
  return knex.schema.createTable('role_permissions', (table) => {
    table.increments('id').primary();
    table.integer('role_id').unsigned().notNullable();
    table.integer('permission_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('role_id').references('id').inTable('roles');
    table.foreign('permission_id').references('id').inTable('permissions');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('role_permissions');
};
