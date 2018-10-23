
exports.up = function(knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.string('phone');
    table.integer('role_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('role_id').references('id').inTable('roles');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
