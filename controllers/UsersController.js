'use strict';

const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Role = require('../models/role');
const paginator = require('../helpers/pagination');

module.exports = {

  // Get users list
  index: async (request, response) => {

    const usersQuery = User.get();

    // Current user email
    const user = request.user;

    const currentPage = request.query.page;

    const role = request.role;

    let created = false;

    // Check if user create new service or not
    if (request.session.created) {
      created = true;
    }

    request.session.created = false;

    // Paginate users rows per page
    try {
      const {result, pagination} = await paginator()(usersQuery, {perPage: 10, page: currentPage});

      return response.status(200).render('snippets/pages/user/users', {
        isAdmin: role.admin,
        users: result,
        email: user.email,
        pages: pagination.lastPage,
        current: pagination.currentPage,
        user: user,
        userOrgs: request.session.userOrgs,
        created: created
      });
    } catch (error) {
      console.log(error)
      return response.status(412).json(error);
    }
  },

  // Get `adduser` page
  create: async (request, response) => {
    const role = request.role;
    const user = request.user;

    try {
      const roles = await Role.get();
      console.log(roles)
      return response.render('snippets/pages/user/create', {
        isAdmin: role.admin,
        roles: roles,
        user: user,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      
    }
  },

  // Store new user in database
  store: async (request, response) => {
    const body = request.body;

    // Hashing password
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(request.body.password, salt);

    const newUser = {
      ...body,
      password: passwordHash
    };

    try {
      const addedUser = await User.save(newUser);
      request.session.created = true;
      return response.status(200).end();

    } catch (error) {
      return response.status(412).json(error);
    }
  },

  // Get edit page
  edit: async (request, response) => {
    const userId = request.params.userId;

    // Get current user role
    const role = request.role;

    // Current user
    const user = request.user;

    try {
      const editUser = await User.getById(userId);

      const roles = await Role.get();

      if (editUser[0] === 'undefined' || editUser.length < 1) {
        return response.render('snippets/pages/errors/error')
      }

      return response.render('snippets/pages/user/edit', {
        isAdmin: role.admin,
        editUser: editUser[0],
        roles: roles,
        user: user,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      
    }
  },

  // Update a single user
  update: async (request, response) => {

    const { userId } = request.params;
    const body = request.body;

    let user = {
      ...body
    };

    /* 
      Check password key value existence in body
      Remove the key if value is undefined
    */
    if (!(request.body.password === '' || typeof request.body.password === 'undefined')) {

      // Hashing password
      const salt = await bcrypt.genSalt(10);

      const passwordHash = await bcrypt.hash(request.body.password, salt);

      user = {
        ...body,
        password: passwordHash
      };
    } else {
      // Remove password key
      delete user['password'];
    }

    try {
      const updatedUser = await User.update(user, userId);

      return response.status(200).json(updatedUser[0]);

    } catch (error) {
      return response.status(412).json(error);
    }
  },

  // Remove a user from databes
  delete: async (request, response) => {

    const userId = request.params.userId;
    const currentUser = request.user;

    if (Number(userId) === currentUser.id) {
      return response.json({success: false, message: 'Hah!!!! How can you kill yourself mather f*cker?'});
    }

    try {
      await User.remove(userId);

      return response.status(204).end();
      
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  search: async (request, response) => {
    const {query} = request.query;
    const currentUser = request.user;
    try {
      const users = await User.search(query);

      users.forEach(user => {
        user.currentemail = currentUser.email
      });

      response.status(200).send(users);
    } catch (error) {
      console.log(error)
      response.status(400).json(error);
    }
  }
};
