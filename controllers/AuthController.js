'use strict';

module.exports = {
  login: (req, res) => {
    const flashMsg = req.flash('loginMessage');
    if (flashMsg.length > 0) {
      return res.sendStatus(401);
    }
    return res.render('snippets/pages/user/login');
  },

  logout: (req, res) => {
    req.logout();
    req.session.org_id = null;
    res.redirect('/login');
  }
};
