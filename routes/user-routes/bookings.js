'use strict';

const router = require('express-promise-router')();

const bookingCtrl = require('../../controllers/BookingsController');

/*
  Route GET : /bookings
  Desc Get all bookings
  Access Private
*/
router.route('/bookings')
  .get(bookingCtrl.index);

/*
  Route GET : /bookings/search
  Desc Get a bookings
  Access Private
*/
router.route('/bookings/search')
  .get(bookingCtrl.search);

/*
  Route GET | POST : /bookings/add
  Desc Add new booking
  Access Private
*/
router.route('/bookings/add')
  .get(bookingCtrl.create)
  .post(bookingCtrl.store);

/*
  Route GET | PUT | DELETE : /bookings/:empId
  Desc Update or remove booking
  Access Private
*/
router.route('/bookings/:bkId')
  .get(bookingCtrl.edit)
  .put(bookingCtrl.update)
  .delete(bookingCtrl.delete);

module.exports = router;
