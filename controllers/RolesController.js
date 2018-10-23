'use strict';

const Role = require('../models/role');
const paginator = require('../helpers/pagination');

module.exports = {

  // Get roles list
  index: async (request, response) => {
    const rolesQuery = Role.get();

    const currentPage = request.query.page;
    const role = request.role;
    const user = request.user;
    let created = false;

    // Check if user add new permission or not
    if (request.session.created) {
      created = true;
    }

    request.session.created = false;

    // Paginate roles rows per page
    try {
      const {result, pagination} = await paginator()(rolesQuery, {perPage: 10, page: currentPage});

      return response.status(200).render('snippets/pages/role/roles', {
        isAdmin: role.admin,
        roles: result,
        pages: pagination.lastPage,
        current: pagination.currentPage,
        user: user,
        userOrgs: request.session.userOrgs,
        created: created
      });
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  create: async (request, response) => {
    const role = request.role;
    const user = request.user;

    try {
      const roles = await Role.get();

      return response.render('snippets/pages/role/create', {
        isAdmin: role.admin,
        roles: roles,
        user: user,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      
    }
  },

  // Store new role in database
  store: async (request, response) => {
    const role = request.body;

    try {
      const newRole = await Role.save(role);

      return response.status(200).end();

    } catch (error) {
      return response.status(412).json(error);
    }
  },

  edit: async (request, response) => {
    const roleId = request.params.roleId;
    const role = request.role;
    const user = request.user;

    try {
      const roles = await Role.get();
      const currentRole = await Role.getById(roleId);

      return response.render('snippets/pages/role/edit', {
        isAdmin: role.admin,
        roles: roles,
        currentRole: currentRole[0],
        user: user,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      
    }
  },

  // Update a single role
  update: async (request, response) => {
    const {roleId} = request.params;
    const role = request.body;

    try {
      const updatedRole = await Role.update(role, roleId);

      return response.status(200).end();
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  // Remove a role from database
  delete: async (request, response) => {
    const roleId = request.params.roleId;
    console.log(roleId)
    try {
      await Role.remove(roleId);

      return response.status(204).end();
    } catch (error) {
      return response.status(412).json(error);
    }
  }
};
