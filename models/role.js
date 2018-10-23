const knex = require('../db/knex');

const moment = require('moment');

module.exports = {

  get() {
    return knex.select('*')
      .from('roles')
      .where(knex.raw('deleted_at is null'))
      .orderBy('roles.id', 'asc');
  },

  getById(roleId) {
    return knex.select('*')
            .from('roles')
            .where({id: roleId});
  },

  save(role) {
    return knex.insert(role)
            .into('roles');
  },

  update(role, roleId) {
    return knex('roles')
            .where({id: roleId})
            .update({...role, 'updated_at': null})
  },

  remove(roleId) {
    return knex('roles')
            .where({id: roleId})
            .update({'deleted_at': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
  }
};
