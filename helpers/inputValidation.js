const Joi = require('joi');

/*
  User input validation
*/

module.exports.login = {
  validateBody: schema => {
    return (req, res, next) => {

      // Validate body
      const result = Joi.validate(req.body, schema);

      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }

      req.value['body'] = result.value;
      next();
    };
  },

  // Log in validation schema
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }
};

module.exports.adduser = {
  validateBody: schema => {
    return (req, res, next) => {

      // Validate body
      const result = Joi.validate(req.body, schema);

      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }

      req.value['body'] = result.value;
      next();
    };
  },

  // Add user validation schema
  schemas: {
    authSchema: Joi.object().keys({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.optional(),
      password: Joi.string().required(),
      role_id: Joi.number().required()
    })
  }
};

module.exports.addrole = {
  validateBody: schema => {
    return (req, res, next) => {

      // Validate body
      const result = Joi.validate(req.body, schema);

      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }

      req.value['body'] = result.value;
      next();
    };
  },

  // Add user validation schema
  schemas: {
    authSchema: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string()
    })
  }
};

module.exports.addclient = {
  validateBody: schema => {
    return (req, res, next) => {

      // Validate body
      const result = Joi.validate(req.body, schema);

      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }

      req.value['body'] = result.value;
      next();
    };
  },

  // Add client validation schema
  schemas: {
    authSchema: Joi.object().keys({
      organization_id: Joi.number().required(),
      source_id: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      sex: Joi.string().allow('').optional(),
      email: Joi.string().email().required(),
      phone: Joi.number().allow('').optional(),
      address: Joi.string().allow('').optional(),
      comment: Joi.string().allow('').optional()
    })
  }
};

module.exports.addpersonnel = {
  validateBody: schema => {
    return (req, res, next) => {

      // Validate body
      const result = Joi.validate(req.body, schema);

      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }

      req.value['body'] = result.value;
      next();
    };
  },

  // Add personnel validation schema
  schemas: {
    authSchema: Joi.object().keys({
      org_id: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.number().allow('').optional(),
      dateofbirth: Joi.date().allow('').optional(),
      facebook: Joi.string().allow('').optional(),
      service: [Joi.array(), Joi.number()],
      from: Joi.array(),
      to: Joi.array()
    })
  }
};
