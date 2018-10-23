const knex = require('../db/knex');

module.exports = {
  getById(id) {
    return knex.select('*')
            .from('organization_packets')
            .where({id: id})
  },

  save(org_packet) {
    return knex.insert(org_packet)
            .into('organization_packets');
  },

  update(id) {
    const currentDate = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    return knex('organization_packets')
            .where({id: id})
            .update({'end_date': currentDate, 'updated_at': null});
  }
};
