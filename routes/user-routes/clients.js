'use strict';

const router = require('express-promise-router')();

const clientsCtrl = require('../../controllers/ClientsController');
const {addclient} = require('../../helpers/inputValidation');

/*
  Route GET : /clients
  Desc Get all clients
  Access Private
*/
router.route('/clients')
  .get(clientsCtrl.index);

/*
  Route GET : /clients/search
  Desc Get a client
  Access Private
*/
router.route('/clients/search')
  .get(clientsCtrl.search);

/*
  Route GET | POST : /clients/add
  Desc Store new client
  Access Private
*/
router.route('/clients/add')
  .get(clientsCtrl.create)
  .post(addclient.validateBody(addclient.schemas.authSchema), clientsCtrl.store);

/*
  Route GET | PUT | DELETE : /personnel/:empId
  Desc Update or remove client
  Access Private
*/
router.route('/clients/:clientId')
  .get(clientsCtrl.edit)
  .put(clientsCtrl.update)
  .delete(clientsCtrl.delete);

module.exports = router;
