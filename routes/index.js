const home           = require('./home');
const users          = require('./admin-routes/users');
const auth           = require('./auth');
const roles          = require('./admin-routes/roles');
const permissions    = require('./admin-routes/permissions');
const organizations  = require('./admin-routes/organizations');
const personnel      = require('./user-routes/personnel');
const services       = require('./user-routes/services');
const clients        = require('./user-routes/clients');
const bookings       = require('./user-routes/bookings');
const reports        = require('./user-routes/reports');
const profile        = require('./user-routes/profile');

module.exports = {
  home,
  auth,
  users,
  roles,
  permissions,
  organizations,
  personnel,
  services,
  clients,
  bookings,
  reports,
  profile
};
