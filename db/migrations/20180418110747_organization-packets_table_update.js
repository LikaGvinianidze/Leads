
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('organization_packets', (table) => {
    table.date('end_date').nullable().alter();
  });
};

exports.down = function(knex, Promise) {

};
