
exports.up = function(knex, Promise) {
  return knex.schema.table('sources', (table) => {
    table.dropForeign('organization_id', 'sources_organization_id_foreign');
    table.dropColumn('organization_id');
  });
};

exports.down = function(knex, Promise) {
  
};
