const knex = require('../db/knex');

const moment = require('moment');

module.exports = {
  getAll() {
    return knex.select('*')
            .from('services')
            .where(knex.raw('deleted_at is null'))
            .orderBy('created_at', 'desc');
  },

  getByOrg(orgId) {
    return knex.select('*')
            .from('services')
            .where(knex.raw('deleted_at is null'))
            .andWhere({organization_id: orgId || null});
  },

  getById(serviceId) {
    return knex.select('s.*', 'org.name as oname')
            .from('services as s')
            .join('organizations as org', 's.organization_id', 'org.id')
            .where('s.id', serviceId);
  },

  save(service) {
    return knex.insert(service)
            .into('services');
  },

  update(service, serviceId) {
    return knex('services')
            .where({id: serviceId})
            .update({...service, 'updated_at': null});
  },

  remove(serviceId) {
    return knex('services')
            .where({id: serviceId})
            .update({'deleted_at': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
  },

  removeOrg(serviceId) {
    return knex('servces')
            .where({id: serviceId})
            .update()
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
