const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const {getUser} = require('../helpers/passportHelpers');
const {getById} = require('../models/user');

module.exports = function(passport) {
  /*
     Serialize
  */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {

    try {

      const user = await getById(id);

      done(null, user[0]);
    } catch (error) {
      return done(err);
    }
  });

  /*
     Set up local strategies
  */

  passport.use(
    'local-login',
    new LocalStrategy({

      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (request, email, password, done) => {

      // Get user by email
      getUser(email, async (error, user) => {
        if (error) {
          return done(error);
        }

        // Check email existence
        if (!(typeof user !== 'undefined' && user.length > 0)) {
          return done(null, false, request.flash('loginMessage', 'not found.'));
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
          return done(null, false, request.flash('loginMessage', 'wrong password.'));
        }

        return done(null, user[0]);
      });
    })
  );
};
