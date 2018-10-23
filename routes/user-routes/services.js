'use strict';

const router = require('express-promise-router')();

const servicesCtrl = require('../../controllers/ServicesController');


/*
  Route GET : /services
  Desc Get all services
  Access Private
*/
router.route('/services')
  .get(servicesCtrl.index);

router.route('/services/search')
  .get(servicesCtrl.search);

/*
  Route GET | POST : /services/add
  Desc Store new service
  Access Private
*/
router.route('/services/add')
  .get(servicesCtrl.create)
  .post(servicesCtrl.store);

/*
  Route GET | PUT | DELETE : /services/:serviceId
  Desc Update or remove service
  Access Private
*/
router.route('/services/:serviceId')
  .get(servicesCtrl.edit)
  .put(servicesCtrl.update)
  .delete(servicesCtrl.delete);

module.exports = router;
