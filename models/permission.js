const knex = require('../db/knex');

const moment = require('moment');

module.exports = {

  get() {
    return knex.select('*')
            .from('permissions')
            .where(knex.raw('deleted_at is null'))
            .orderBy('permissions.id', 'asc');
  },

  getById(permissionId) {
    return knex.select('*')
            .from('permissions')
            .where({id: permissionId});
  },

  save(permission) {
    return knex.insert(permission)
            .into('permissions');
  },

  update(permission, permissionId) {
    return knex('permissions')
            .where({id: permissionId})
            .update({...permission, 'updated_at': null})
  },

  remove(permissionId) {
    return knex('permissions')
            .where({id: permissionId})
            .update({'deleted_at': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
  }
};
