const knex = require('../db/knex');

const moment = require('moment');

module.exports = {
  getAll() {
    return knex.select('*')
            .from('personnel')
            .where(knex.raw('deleted_at is null'))
            .orderBy('created_at', 'desc');
  },

  getByOrg(orgId) {
    return knex.select('*')
            .from('personnel')
            .where(knex.raw('deleted_at is null'))
            .andWhere({organization_id: orgId || null});
  },

  getById(empId) {
    return knex.select('*')
            .from('personnel')
            .where({id: empId});
  },

  save(employ) {
    return knex.insert(employ)
            .into('personnel');
  },

  update(employ, empId) {
    return knex('personnel')
            .where({id: empId})
            .update(employ);
  },

  remove(empId) {
    return knex('personnel')
            .where({id: empId})
            .update({'deleted_at': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')});
  },

  getEmpServices(empId) {
    return knex.select('s.id', 's.name')
            .from('services as s')
            .innerJoin('personnel_services as ps', 'ps.service_id', 's.id')
            .where({personnel_id: empId});
  },

  removeService(empId, serviceId) {
    return knex('personnel_services')
            .where({personnel_id: empId})
            .andWhere({service_id: serviceId})
            .delete();
  },

  getEmpSchedule(empId) {
    return knex.select('*')
            .from('personnel_schedule')
            .where({personnel_id: empId});
  },

  saveEmpSchedule(schedule) {
    return knex.insert(schedule)
            .into('personnel_schedule');
  },

  updateEmpSchedule(schedule, empId) {
    let query = '';
    let bindings = [];

    schedule.forEach(day => {
      const q = knex('personnel_schedule')
        .where({personnel_id: empId})
        .andWhere({day: day.day})
        .update(day);

      const obj = q.toSQL().toNative();
      query += obj.sql + ';';
      bindings.push(obj.bindings);
    });
    const qs = query.split(';')
    for (let i = 0; i < bindings.length; i++) {
      knex.raw(knex.raw(qs[i], bindings[i]) + '')
        .then(data => console.log('updated'))
        .catch(error => {
          console.log(error);
        });
    }
  },

  saveEmpServices(services) {
    return knex.insert(services)
            .into('personnel_services');
  },

  search(name, orgId) {
    return knex.select('*')
            .from('personnel')
            .where(function() {
              this.where(knex.raw('deleted_at is null'))
                  .andWhere('firstname', 'like', `${name}%`)
                  .orWhere('lastname', 'like', `${name}%`)
            })
            .andWhere({organization_id: orgId})
            .orderBy('created_at', 'desc');
  }
};
