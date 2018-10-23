'use strict';

const Organization = require('../models/organization');
const User = require('../models/user');
const paginator = require('../helpers/pagination');

module.exports = {

  // Get user's organizations
  orgs: async (request, response) => {
    const currentPage = request.query.page;
    const role = request.role;
    const user = request.user;

    const orgsQuery = Organization.getUserOrgs(user.id);

    // Paginate organizations rows per page
    try {
      const {result, pagination} = await paginator()(orgsQuery, {perPage: 10, page: currentPage});
      console.log(result);
      return response.status(200).render('snippets/pages/profile/index', {
        isAdmin: role.admin,
        orgs: result,
        pages: pagination.lastPage,
        current: pagination.currentPage,
        user: user,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      console.log(error)
      return response.status(412).json(error);
    }
  },

  profile: async (request, response) => {
    const currentUser = request.user;
    try {
      const user = await User.getById(currentUser.id);

      response.json(user[0]);
    } catch (error) {
      console.log(error);
      return response.status(412).json(error);
    }
  },

  update: async (request, response) => {

  }
};
