'use strict';

const router = require('express-promise-router')();

const rolesCtrl = require('../../controllers/RolesController');
const {addrole} = require('../../helpers/inputValidation');

router.route('/roles')
  .get(rolesCtrl.index);

router.route('/roles/add')
  .get(rolesCtrl.create)
  .post(addrole.validateBody(addrole.schemas.authSchema),rolesCtrl.store);

router.route('/roles/:roleId')
  .get(rolesCtrl.edit)
  .put(rolesCtrl.update)
  .delete(rolesCtrl.delete);

module.exports = router;
