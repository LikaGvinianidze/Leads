'use strict';

const router = require('express-promise-router')();

const indexCtrl = require('../controllers/HomeController');

router.route('/')
  .get(indexCtrl.get)
  .post((req, res) => {
    let orgId = req.body.orgId;

    if (req.body.orgid) {
      orgId = req.body.orgid;
    }

    req.session.org_id = orgId;

    return res.redirect('/');
  });

module.exports = router;
