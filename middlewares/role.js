const {isAdmin} = require('../helpers/isAdmin');

const role = async (request, response, next) => {

  // get current user
  const user = request.user;

  // check user role group
  const isAdminRole = await isAdmin(user);

  // write role object in request
  if (isAdminRole) {
    request.role = {
      admin: true,
      name: 'admin'
    }
  } else {
    request.role = {
      admin: false,
      name: 'manager'
    }
  }

  return next();
};

module.exports = {role};