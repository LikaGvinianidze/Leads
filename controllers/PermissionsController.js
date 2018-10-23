'use strict';

const Permission = require('../models/permission');
const paginator = require('../helpers/pagination');

module.exports = {

  // Get roles list
  index: async (request, response) => {
    const permissionsQuery = Permission.get();

    const currentPage = request.query.page;
    const role = request.role;
    const user = request.user;
    let created = false;

    // Check if user add new permission or not
    if (request.session.created) {
      created = true;
    }

    request.session.created = false;

    // Paginate permissions rows per page
    try {
      const {result, pagination} = await paginator()(permissionsQuery, {perPage: 10, page: currentPage});

      return response.status(200).render('snippets/pages/permission/permissions', {
        isAdmin: role.admin,
        permissions: result,
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
      const permissions = await Permission.get();

      return response.render('snippets/pages/permission/create', {
        isAdmin: role.admin,
        permissions: permissions,
        user: user,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      
    }
  },

  // Store new role in database
  store: async (request, response) => {
    const permission = request.body;

    try {
      const newPermission = await Permission.save(permission);

      return response.status(200).end();

    } catch (error) {
      console.log(error)
      return response.status(412).json(error);
    }
  },

  edit: async (request, response) => {
    const permId = request.params.permId;
    const role = request.role;
    const user = request.user;

    try {
      const permissions = await Permission.get();
      const permission = await Permission.getById(permId);

      return response.render('snippets/pages/permission/edit', {
        isAdmin: role.admin,
        permissions: permissions,
        currentPermission: permission[0],
        user: user,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      console.log(error)
    }
  },

  // Update a single role
  update: async (request, response) => {
    const {permId} = request.params;
    const permission = request.body;

    try {
      const updatedPermission = await Permission.update(permission, permId);

      return response.status(200).end();
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  // Remove a role from database
  delete: async (request, response) => {
    const {permId} = request.params;

    try {
      await Permission.remove(permId);

      return response.status(204).end();
    } catch (error) {
      return response.status(412).json(error);
    }
  }
};
