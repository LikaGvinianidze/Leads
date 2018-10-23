const Role = require('../models/role');

/*
  Helper function
  returns true if loged in user is admin
*/

const isAdmin = async (user) => {
  try {
    const roleId = user.role_id;

    const role = await Role.getById(roleId);

    if (role[0].name === 'Admin') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error)
  }
};

module.exports = {isAdmin};