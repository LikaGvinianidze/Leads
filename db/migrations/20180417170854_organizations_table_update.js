
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('organizations', (table) => {
    table.string('address').after('name');
    table.string('info').after('status');
    table.integer('current_packet').after('status').unsigned();

    table.foreign('current_packet').references('id').inTable('organization_packets');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('organizations');
};
