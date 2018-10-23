
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('organizations', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('users', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('packets', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('permissions', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('personnel', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('roles', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('services', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('sources', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('clients', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  })
  .alterTable('bookings', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  });
};

exports.down = function(knex, Promise) {
  
};
