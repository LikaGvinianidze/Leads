const Role = require('../models/role');

const isAdmin = async (request, response, next) => {
  try {
    const roleId = request.user.role_id;

    // Get role
    const role = await Role.getById(roleId);

    // Continue executing if user is from admin role group
    if (role[0].name === 'Admin') {
      return next();
    } else {
      return response.status(403).json({
        success: false,
        message: `access denied for ${role[0].name} role group, you need admin permission.`
      });
    }
  } catch (error) {
    
  }
};

module.exports = {isAdmin};
