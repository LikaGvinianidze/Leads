const knex = require('../db/knex');

const moment = require('moment');

module.exports = {
  get() {
    return knex.select('org.id','org.name','org.status', knex.raw('DATE_FORMAT(org.last_payment_date, "%Y-%m-%d") as paydate'), 'p.name as pname')
            .from('organization_packets as op')
            .join('organizations as org', function() {
              this.on('op.organization_id', '=', 'org.id')
                .andOn(knex.raw('op.end_date is null'))
                .andOn(knex.raw('org.deleted_at is null'))
            })
            .innerJoin('packets as p', 'op.packet_id', 'p.id')
            .orderBy('org.created_at', 'desc');
  },

  getById(orgId) {
    return knex.select('*')
          .from('organizations')
          .where({id: orgId});
  },

  save(organization) {
    return knex.insert(organization)
            .into('organizations');
  },

  update(organization, orgId) {
    return knex('organizations')
            .where({id: orgId})
            .update({...organization, 'updated_at': null})
  },

  remove(orgId) {
    return knex('organizations')
            .where({id: orgId})
            .update({'deleted_at': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
  },

  getOrgPacket(orgId) {
    return knex.select('packets.name')
            .from('organization_packets as op')
            .join('packets', function() {
              this.on('op.packet_id', '=', 'packets.id')
                .andOn(knex.raw('op.end_date is null'))
            })
            .where({organization_id: orgId});
  },

  getOrgUsers(orgId) {
    return knex.select('users.id', 'users.firstname', 'users.lastname')
            .from('organization_users as ou')
            .innerJoin('users', 'ou.user_id', 'users.id')
            .where({organization_id: orgId})
            .andWhere(knex.raw('users.deleted_at is null'));
  },
  /*
    SELECT org.id, org.name
    FROM organization_users AS ou
    INNER JOIN organizations AS org
    ON ou.organization_id = org.id
    INNER JOIN organization_packets as op
    ON op.organization_id = org.id AND op.end_date IS NULL AND org.deleted_at IS NULL
    WHERE user_id = 10
  */
  getUserOrgs(userId) {
    return knex.select('org.id', 'org.name')
            .from('organization_users as ou')
            .innerJoin('organizations as org', 'ou.organization_id', 'org.id')
            .join('organization_packets as op', function() {
              this.on('op.organization_id', '=', 'org.id')
                .andOn(knex.raw('op.end_date is null'))
                .andOn(knex.raw('org.deleted_at is null'))
            })
            .where({user_id: userId})
            .andWhere(knex.raw('org.deleted_at is null'));
  },

  saveOrgUser(orgUser) {
    return knex.insert(orgUser)
            .into('organization_users');
  },

  deleteOrgUser(orgId, userId) {
    return knex('organization_users')
            .where({organization_id: orgId})
            .andWhere({user_id: userId})
            .delete();
  },

  getOrgSchedule(orgId) {
    return knex.select('*')
            .from('organization_schedule')
            .where({organization_id: orgId})
  },

  saveOrgSchedule(orgSchedule) {
    return knex.insert(orgSchedule)
            .into('organization_schedule');
  },

  async updateOrgSchedule(orgSchedule, orgId) {
    orgSchedule.forEach(day => {
      knex('organization_schedule')
        .where({organization_id: orgId})
        .andWhere({day: day.day})
        .update(day)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        })
    });
  },

  search(name) {
    return knex.select('org.id','org.name','org.status','p.name as pname')
            .from('organization_packets as op')
            .join('organizations as org', function() {
              this.on('op.organization_id', '=', 'org.id')
                .andOn(knex.raw('op.end_date is null'))
                .andOn(knex.raw('org.deleted_at is null'))
            })
            .innerJoin('packets as p', 'op.packet_id', 'p.id')
            .where(function() {
              this.where('org.name', 'like', `${name}%`)
            })
            .orderBy('org.name');
  }
};
