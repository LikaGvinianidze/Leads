'use strict';

const router = require('express-promise-router')();

router.route('/reports')
  .get((request, response) => {
    return response.status(200).json({success: true});
  });

module.exports = router;
