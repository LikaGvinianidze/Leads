'use strict';

const router = require('express-promise-router')();

const personnelCtrl = require('../../controllers/PersonnelController');
const {addpersonnel} = require('../../helpers/inputValidation');

/*
  Route GET : /personnel
  Desc Get all employees
  Access Private
*/
router.route('/personnel')
  .get(personnelCtrl.index);

/*
  Route GET : /personnel/search
  Desc Get a employ
  Access Private
*/
router.route('/personnel/search')
  .get(personnelCtrl.search);

/*
  Route GET | POST : /personnel/add
  Desc Store new employ
  Access Private
*/
router.route('/personnel/add')
  .get(personnelCtrl.create)
  .post(addpersonnel.validateBody(addpersonnel.schemas.authSchema), personnelCtrl.store);

/*
  Route GET | PUT | DELETE : /personnel/:empId
  Desc Update or remove employ
  Access Private
*/
router.route('/personnel/:empId')
  .get(personnelCtrl.edit)
  .put(personnelCtrl.update)
  .delete(personnelCtrl.delete);

router.route('/personnel/services/:serviceId/:empId')
  .delete(personnelCtrl.removeService);


module.exports = router;
