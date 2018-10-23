const knex = require('../db/knex');

const moment = require('moment');

module.exports = {
  getAll() {
    return knex.select('*')
            .from('bookings')
            .where(knex.raw('deleted_at is null'))
            .orderBy('created_at', 'desc');
  },

  getByOrg(bkId) {
    return knex.select('*')
            .from('bookings')
            .where(knex.raw('deleted_at is null'))
            .andWhere({organization_id: bkId || null});
  },

  getById(bkId) {
    return knex.select('s.*', 'org.name as oname')
            .from('services as s')
            .join('organizations as org', 's.organization_id', 'org.id')
            .where('s.id', bkId);
  },

  save(booking) {
    return knex.insert(booking)
            .into('bookings');
  },

  update(booking, bkId) {
    return knex('bookings')
            .where({id: bkId})
            .update({...booking, 'updated_at': null});
  },

  remove(bkId) {
    return knex('services')
            .where({id: bkId})
            .update({'deleted_at': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
  },

  search(name, orgId) {
    return knex.select('*')
            .from('services')
            .where(function() {
              this.where(knex.raw('deleted_at is null'))
                .andWhere('name', 'like', `${name}%`)
            })
            .andWhere({organization_id: orgId})
            .orderBy('name');
  }
};
