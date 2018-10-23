'use strict';

const qs = require('querystring');

const Service = require('../models/service');
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
      let servicesQuery = null;

      if (role.admin == true && selected == true) {
        servicesQuery = Service.getByOrg(orgId);
      } else if (role.admin == true) {
        servicesQuery = undefined;
        selected = false;
      } else {
        servicesQuery = Service.getByOrg(orgId || undefined);
      }

      const {result, pagination} = await paginator()(servicesQuery, {perPage: 10, page: currentPage});
      return response.status(200).render('snippets/pages/service/services', {
        isAdmin: role.admin,
        services: result,
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
      return response.render('snippets/pages/service/create', {
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
    const body = request.body;
    const service = {
      organization_id: body.org_id,
      name: body.name,
      description: body.description,
      cost: body.cost * 100,
      duration: body.duration * 60,
      sex: Array.isArray(body.sex) ? JSON.stringify({sex1: body.sex[0], sex2: body.sex[1], sex3: body.sex[2]}) : JSON.stringify({sex1: body.sex})
    };

    try {
      await Service.save(service);

      // Store in session after successful insertion
      request.session.created = true;
      return response.status(201).end();
    } catch (error) {
      console.log(error);
      return response.status(402).json(error);
    }
  },

  edit: async (request, response) => {
    const serviceId = request.params.serviceId;
    const role = request.role;
    const user = request.user;

    try {
      const service = await Service.getById(serviceId);
      const userOrgs = await Organization.getUserOrgs(user.id);

      const hasOrg = userOrgs.filter(userOrg => service[0].organization_id === userOrg.id);

      return response.render('snippets/pages/service/edit', {
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
    const {serviceId} = request.params;
    const body = request.body
    console.log(body, body.cost)
    const service = {
      name: body.name,
      description: body.description,
      cost: body.cost * 100,
      duration: body.duration * 60,
      sex: Array.isArray(body.sex) ? JSON.stringify({sex1: body.sex[0], sex2: body.sex[1], sex3: body.sex[2]}) : JSON.stringify({sex1: body.sex})
    }

    try {
      await Service.update(service, serviceId);

      return response.status(201).end()
    } catch (error) {
      console.log(error);
      response.json(error);
    }
  },

  // Remove a service from database
  delete: async (request, response) => {
    const {serviceId} = request.params;

    try {
      await Service.remove(serviceId);

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
      const services = await Service.search(query, orgId);
      response.status(200).send(services);
    } catch (error) {
      console.log(error)
      response.status(400).json(error);
    }
  }
};
