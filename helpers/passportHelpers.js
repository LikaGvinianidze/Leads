const knex = require('../db/knex');

const getUser = (email, done) => {
  knex.select()
      .from('users')
      .where('email', email)
      .then(user => done(null, user))
      .catch(err => done(err));
};

module.exports = {getUser};
