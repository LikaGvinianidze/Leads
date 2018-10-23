'use strict';

const Organization = require('../models/organization');

module.exports = {

  get: async (request, response) => {
    const role = request.role;
    const user = request.user;
    let userOrgs = null;

    try {
      if (role.admin) {
        userOrgs = await Organization.get();
      } else {
        userOrgs = await Organization.getUserOrgs(user.id);
      }

      request.session.userOrgs = userOrgs;

      response.render('index', {
        isAdmin: role.admin,
        user: user,
        userOrgs: userOrgs
      });
    } catch (error) {
      console.log(error);
    }
  },
};
