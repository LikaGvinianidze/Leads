'use strict';

const router = require('express-promise-router')();

const usersCtrl = require('../../controllers/UsersController');
const {adduser} = require('../../helpers/inputValidation');

/*
  User todos
*/

router.route('/users')
  .get(usersCtrl.index);

router.route('/users/search')
  .get(usersCtrl.search);

router.route('/users/add')
  .get(usersCtrl.create)
  .post(adduser.validateBody(adduser.schemas.authSchema), usersCtrl.store);

router.route('/users/:userId')
  .get(usersCtrl.edit)
  .put(usersCtrl.update)
  .delete(usersCtrl.delete);

module.exports = router;
