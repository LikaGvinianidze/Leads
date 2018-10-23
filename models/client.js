const knex = require('../db/knex');

const moment = require('moment');

module.exports = {
  get() {
    return knex.select('*')
            .from('clients')
            .where(knex.raw('deleted_at is null'));
  },

  getById(clientId) {
    return knex.select('c.*', 'org.name')
            .from('clients as c')
            .innerJoin('organizations as org', 'c.organization_id', 'org.id')
            .where('c.id', clientId)
            .andWhere(knex.raw('c.deleted_at is null'));
  },

  save(client) {
    return knex.insert(client)
            .into('clients');
  },

  update(client, clientId) {
    return knex('clients')
            .where({id: clientId})
            .update({...client, 'updated_at': null});
  },

  remove(clientId) {
    return knex('organizations')
            .where({id: clientId})
            .update({'deleted_at': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
  },

  search(name, orgId) {
    return knex.select('*')
            .from('clients')
            .where(function() {
              this.where(knex.raw('deleted_at is null'))
                  .andWhere('firstname', 'like', `${name}%`)
                  .orWhere('lastname', 'like', `${name}%`)
            })
            .andWhere({organization_id: orgId})
            .orderBy('firstname');
  },

  getByOrg(orgId) {
    return knex.select('*')
            .from('clients')
            .where({organization_id: orgId})
            .andWhere(knex.raw('deleted_at is null'));
  },

  getSources() {
    return knex.select('id', 'name')
            .from('sources');
  }
}
