
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', (table) => {
    table.string('firstname').collate('utf8_general_ci').notNullable().alter();
    table.string('lastname').collate('utf8_general_ci').notNullable().alter();
  })
  .alterTable('roles', (table) => {
    table.string('name').collate('utf8_general_ci').notNullable().alter();
    table.string('description').collate('utf8_general_ci').alter();
  })
  .alterTable('permissions', (table) => {
    table.string('name').collate('utf8_general_ci').notNullable().alter();
    table.string('description').collate('utf8_general_ci').alter();
  })
  .alterTable('organizations', (table) => {
    table.string('name').collate('utf8_general_ci').notNullable().alter();
    table.string('info').collate('utf8_general_ci').alter();
    table.string('address').collate('utf8_general_ci').alter();
  })
  .alterTable('personnel', (table) => {
    table.string('firstname').notNullable().collate('utf8_general_ci').alter();
    table.string('lastname').notNullable().collate('utf8_general_ci').alter();
  })
  .alterTable('services', (table) => {
    table.string('name').notNullable().collate('utf8_general_ci').alter();
    table.string('description').collate('utf8_general_ci').alter();
  })
  .alterTable('sources', (table) => {
    table.string('name').notNullable().collate('utf8_general_ci').alter();
  })
  .alterTable('clients', (table) => {
    table.string('firstname').collate('utf8_general_ci').notNullable().alter();
    table.string('lastname').collate('utf8_general_ci').notNullable().alter();
    table.string('address').collate('utf8_general_ci').alter();
    table.string('comment').collate('utf8_general_ci').alter();
  })
  .alterTable('packets', (table) => {
    table.string('name').notNullable().collate('utf8_general_ci').alter();
    table.string('description').collate('utf8_general_ci').alter();
  });
};

exports.down = function(knex, Promise) {
  
};
