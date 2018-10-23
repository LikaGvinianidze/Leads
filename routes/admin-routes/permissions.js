'use strict';

const router = require('express-promise-router')();

const permissionsCtrl = require('../../controllers/PermissionsController');
const {addrole} = require('../../helpers/inputValidation');

router.route('/permissions')
  .get(permissionsCtrl.index);

router.route('/permissions/add')
  .get(permissionsCtrl.create)
  .post(addrole.validateBody(addrole.schemas.authSchema), permissionsCtrl.store);

router.route('/permissions/:permId')
  .get(permissionsCtrl.edit)
  .put(permissionsCtrl.update)
  .delete(permissionsCtrl.delete);

module.exports = router;
