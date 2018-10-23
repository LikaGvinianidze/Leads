'use strict';

const qs = require('querystring');

const Booking = require('../models/booking');
const Organization = require('../models/organization');
const paginator = require('../helpers/pagination');

module.exports = {

  // Get services list
  index: async (request, response) => {
    const orgId = request.session.org_id;
    const currentPage = request.query.page;
    const user = request.user;
    const role = request.role;

    let created = false;
    let selected = false;

    // Check if user create new service or not
    if (request.session.created) {
      created = true;
    }

    // Check if user selected organization
    if (!(orgId == null || orgId === undefined || orgId === '')) {
      selected = true;
    }

    request.session.created = false;

    try {
      let bookingsQuery = null;

      if (role.admin == true && selected == true) {
        bookingsQuery = Booking.getByOrg(orgId);
      } else if (role.admin == true) {
        bookingsQuery = undefined;
        selected = false;
      } else {
        bookingsQuery = Booking.getByOrg(orgId || undefined);
      }

      const {result, pagination} = await paginator()(bookingsQuery, {perPage: 10, page: currentPage});
      return response.status(200).render('snippets/pages/booking/bookings', {
        isAdmin: role.admin,
        bookings: result,
        pages: pagination.lastPage,
        current: pagination.currentPage,
        user: user,
        created: created,
        userOrgs: request.session.userOrgs,
        selected: selected,
        currentOrgId: orgId
      });
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  create: async (request, response) => {
    const role = request.role;
    const user = request.user;

    try {
      return response.render('snippets/pages/booking/create', {
        isAdmin: role.admin,
        user: user,
        userOrgs: request.session.userOrgs,
        currentOrgId: request.session.org_id
      });
    } catch (error) {
      console.log(error);
      return response.status(400).end();
    }
  },

  // Store new service in database
  store: async (request, response) => {
    const booking = request.body;
    console.log(booking);
    try {
      await Booking.save(booking);

      // Store in session after successful insertion
      request.session.created = true;
      return response.status(201).end();
    } catch (error) {
      console.log(error);
      return response.status(402).json(error);
    }
  },

  edit: async (request, response) => {
    const bkId = request.params.serviceId;
    const role = request.role;
    const user = request.user;

    try {
      const service = await Booking.getById(bkId);
      const userOrgs = await Organization.getUserOrgs(user.id);

      const hasOrg = userOrgs.filter(userOrg => service[0].organization_id === userOrg.id);

      return response.render('snippets/pages/booking/edit', {
        isAdmin: role.admin,
        service: service[0],
        user: user,
        organizations: userOrgs,
        hasOrg: hasOrg,
        userOrgs: request.session.userOrgs,
        currentOrgId: request.session.org_id
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Update a single service
  update: async (request, response) => {
    const {bkId} = request.params;
    const booking = request.body
    console.log(booking)
    try {
      await Booking.update(booking, bkId);

      return response.status(201).end()
    } catch (error) {
      console.log(error);
      response.json(error);
    }
  },

  // Remove a service from database
  delete: async (request, response) => {
    const {bkId} = request.params;

    try {
      await Booking.remove(bkId);

      return response.status(204).end();
    } catch (error) {
      console.log(error)
      return response.status(412).json(error);
    }
  },

  search: async (request, response) => {
    const orgId = request.session.org_id;
    const {query} = request.query;
    try {
      const bookings = await Booking.search(query, orgId);
      response.status(200).send(bookings);
    } catch (error) {
      console.log(error)
      response.status(400).json(error);
    }
  }
};
