const knex = require('../db/knex');

const moment = require('moment');

module.exports = {

  get() {
    return  knex.select('users.*', 'roles.name')
              .from('users')
              .innerJoin('roles', 'users.role_id', 'roles.id')
              .where(knex.raw('users.deleted_at is null'))
              .orderBy('users.created_at', 'desc');
  },

  getById(userId) {
    return knex.select('*')
              .from('users')
              .where({id: userId});
  },

  save(user) {
    return knex.insert(user)
            .into('users');
  },

  update(user, userId) {
    return knex('users')
            .where({id: userId})
            .update({...user, 'updated_at': null});
  },

  remove(userId) {
    return knex('users')
            .where({id: userId})
            .update({'deleted_at': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
  },

  search(name) {
    return knex.select('users.*', 'roles.name')
              .from('users')
              .innerJoin('roles', 'users.role_id', 'roles.id')
              .where(function() {
                this.where('firstname', 'like', `${name}%`)
                  .orWhere('lastname', 'like', `${name}%`)
              })
              .andWhere(knex.raw('users.deleted_at is null'))
              .orderBy('users.firstname')
  }
};
