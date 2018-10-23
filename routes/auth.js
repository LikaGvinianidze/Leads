'use strict';

const router = require('express-promise-router')();
const passport = require('passport');

const authCtrl = require('../controllers/AuthController');
const {isLoggedIn} = require('../middlewares/auth');
const {login} = require('../helpers/inputValidation');

// Passport strategies
const passportLogin = passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
});

router.route('/login')
  .get(authCtrl.login)
  .post(login.validateBody(login.schemas.authSchema), passportLogin);

router.route('/logout')
  .get(isLoggedIn, authCtrl.logout);

module.exports = router;
