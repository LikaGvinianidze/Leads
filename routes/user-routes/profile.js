'use strict';

const router = require('express-promise-router')();

const profileCtrl = require('../../controllers/ProfileController');
const organizationCtrl = require('../../controllers/OrganizationsController');

router.route('/user/profile')
  .get(profileCtrl.profile)
  .put(profileCtrl.update);

router.route('/user/organizations')
  .get(profileCtrl.orgs);

router.route('/user/organizations/:orgId')
  .get(organizationCtrl.edit)
  .put(organizationCtrl.update);

module.exports = router;
