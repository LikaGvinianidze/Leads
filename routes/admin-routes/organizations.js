'use strict';

const router = require('express-promise-router')();

const orgCtrl = require('../../controllers/OrganizationsController');

router.route('/organizations')
  .get(orgCtrl.index);

router.route('/organizations/search')
  .get(orgCtrl.search);

router.route('/organizations/add')
  .get(orgCtrl.create)
  .post(orgCtrl.store);

router.route('/organizations/:orgId')
  .get(orgCtrl.edit)
  .put(orgCtrl.update)
  .delete(orgCtrl.delete);

router.route('/organizations/users/:userId/:orgId')
  .delete(orgCtrl.removeUser);

module.exports = router;
