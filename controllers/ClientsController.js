'use strict';

const Client = require('../models/client');
const Organization = require('../models/organization');
const paginator = require('../helpers/pagination');

module.exports = {

  // Get roles list
  index: async (request, response) => {
    const orgId = request.session.org_id;
    const currentPage = request.query.page;
    const role = request.role;
    const user = request.user;

    let created = false;
    let selected = false;

    // Check if user add new client or not
    if (request.session.created) {
      created = true;
    }

    // Check if user selected organization
    if (!(orgId == null || orgId === undefined || orgId === '')) {
      selected = true;
    }

    request.session.created = false;

    // Paginate roles rows per page
    try {
      let clientsQuery = null;
      console.log(role)
      if (role.admin == true && selected == true) {
        clientsQuery = Client.getByOrg(orgId);
      } else if (role.admin == true) {      
        clientsQuery = undefined;
        selected = false;
      } else {  
        clientsQuery = Client.getByOrg(orgId || 0);
      }
      console.log(clientsQuery)
      const {result, pagination} = await paginator()(clientsQuery, {perPage: 10, page: currentPage});

      return response.status(200).render('snippets/pages/clients/clients', {
        isAdmin: role.admin,
        clients: result,
        pages: pagination.lastPage,
        current: pagination.currentPage,
        user: user,
        userOrgs: request.session.userOrgs,
        selected: selected,
        currentOrgId: orgId,
        created: created
      });
    } catch (error) {
      console.log(error)
      return response.status(412).json(error);
    }
  },

  create: async (request, response) => {
    const orgId = request.session.org_id;
    const role = request.role;
    const user = request.user;

    try {
      const sources = await Client.getSources();

      return response.render('snippets/pages/clients/create', {
        isAdmin: role.admin,
        sources: sources,
        user: user,
        userOrgs: request.session.userOrgs,
        currentOrgId: orgId
      });
    } catch (error) {
      
    }
  },

  // Store new role in database
  store: async (request, response) => {
    const client = request.body;

    try {
      await Client.save(client);
      request.session.created = true;
      return response.status(200).end();
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  edit: async (request, response) => {
    const orgId = request.session.org_id;
    const clientId = request.params.clientId;
    const role = request.role;
    const user = request.user;

    try {
      const client = await Client.getById(clientId);
      const sources = await Client.getSources();

      return response.render('snippets/pages/clients/edit', {
        isAdmin: role.admin,
        user: user,
        client: client[0],
        sources: sources,
        userOrgs: request.session.userOrgs,
        currentOrgId: orgId
      });
    } catch (error) {
      console.log(error)
    }
  },

  // Update a single client
  update: async (request, response) => {
    const {clientId} = request.params;
    const client = request.body;
    try {
      await Client.update(client, clientId);
      return response.status(200).end();
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  // Remove a client from database
  delete: async (request, response) => {
    const clientId = request.params.clientId;

    try {
      await Client.remove(clientId);

      return response.status(204).end();
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  search: async (request, response) => {
    const orgId = request.session.org_id;
    const {query} = request.query;
    try {
      const clients = await Client.search(query, orgId);
      response.status(200).send(clients);
    } catch (error) {
      console.log(error)
      response.status(400).json(error);
    }
  }
};
