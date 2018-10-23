'use strict';

const moment = require('moment');

const Personnel = require('../models/personnel');
const Service = require('../models/service');
const Organization = require('../models/organization');
const paginator = require('../helpers/pagination');

module.exports = {

  // Get employees list
  index: async (request, response) => {
    const orgId = request.session.org_id;
    const currentPage = request.query.page;
    const role = request.role;
    const user = request.user;

    let created = false;
    let selected = false;

    // Check if user create new service or not
    if (request.session.created) {
      created = true;
    }
    request.session.created = false;
    // Check if user selected organization
    if (!(orgId == null || orgId === undefined || orgId === '')) {
      selected = true;
    }

    // Paginate employees rows per page
    try {
      let personnelQuery = null;

      if (role.admin == true && selected == true) {
        personnelQuery = Personnel.getByOrg(orgId);
      } else if (role.admin == true) {
        personnelQuery = undefined
        selected = false;
      } else {
        personnelQuery = Personnel.getByOrg(orgId || undefined);
      }

      const {result, pagination} = await paginator()(personnelQuery, {perPage: 10, page: currentPage});

      return response.status(200).render('snippets/pages/personnel/personnel', {
        isAdmin: role.admin,
        employees: result,
        pages: pagination.lastPage,
        current: pagination.currentPage,
        user: user,
        userOrgs: request.session.userOrgs,
        selected: selected,
        created: created,
        userOrgs: request.session.userOrgs,
        currentOrgId: orgId
      });
    } catch (error) {
      console.log(error);
      return response.status(412).json(error);
    }
  },

  create: async (request, response) => {
    const role = request.role;
    const user = request.user;
    const orgId = request.session.org_id;

    try {
      const services = await Service.getByOrg(orgId);

      return response.render('snippets/pages/personnel/create', {
        isAdmin: role.admin,
        services: services,
        user: user,
        userOrgs: request.session.userOrgs,
        currentOrgId: orgId
      });
    } catch (error) {
      
    }
  },

  // Store new employ in database
  store: async (request, response) => {
    const body = request.body;
    const orgId = request.session.org_id;
    console.log(body);
    // For new employ
    const employ = {
      firstname: body.firstname,
      lastname: body.lastname,
      dateofbirth: body.dateofbirth,
      email: body.email,
      facebook: body.facebook,
      phone: body.phone,
      organization_id: orgId // will be changed by request.session.org_id
    };

    const empSchedule = [];
    const empServices = [];

    try {
      const empId = await Personnel.save(employ);

      const empSchedule = builder().scheduleBuilder(body, empId, orgId)
      const empServices = builder().servicesBuilder(body, empId, orgId);

      // Store schedule for new employ
      await Personnel.saveEmpSchedule(empSchedule);
      // Store services for new employ
      await Personnel.saveEmpServices(empServices);

      request.session.created = true;

      return response.status(200).end();
    } catch (error) {
      console.log(error);
      return response.status(412).json(error);
    }
  },

  edit: async (request, response) => {
    const empId = request.params.empId;
    const role = request.role;
    const user = request.user;
    const orgId = request.session.org_id;

    try {
      const personnel = await Personnel.getById(empId);
      const empSchedule = await Personnel.getEmpSchedule(empId);
      const empServices = await Personnel.getEmpServices(empId);
      const orgServices = await Service.getByOrg(orgId);

      const employ = {
        ...personnel[0],
        dateofbirth: moment(personnel[0].dateofbirth).format('YYYY-MM-DD')
      };
      console.log(employ)
      return response.render('snippets/pages/personnel/edit', {
        isAdmin: role.admin,
        workDays: empSchedule,
        empServices: empServices,
        services: orgServices,
        employ: employ,
        user: user,
        userOrgs: request.session.userOrgs,
        currentOrgId: orgId
      });
    } catch (error) {
      
    }
  },

  // Update a single employ
  update: async (request, response) => {
    const {empId} = request.params;
    const body = request.body;
    console.log(body)
    const orgId = request.session.org_id;
    // For update employ
    const employ = {
      firstname: body.firstname,
      lastname: body.lastname,
      dateofbirth: body.dateofbirth,
      email: body.email,
      facebook: body.facebook,
      phone: body.phone,
      organization_id: orgId // will be changed by request.session.org_id
    };

    const empSchedule = builder().scheduleBuilder(body, empId, orgId);
    try {
      await Personnel.update(employ, empId);
      await Personnel.updateEmpSchedule(empSchedule, empId, orgId);
      if (body.service) {
        console.log(body.service, '  sfewef')
        const empServices = builder().servicesBuilder(body, empId, orgId);
        await Personnel.saveEmpServices(empServices);
      }

      return response.status(200).end();
    } catch (error) {
      console.log(error);
      return response.status(412).json(error);
    }
  },

  // Remove a employ from database
  delete: async (request, response) => {
    const empId = request.params.empId;

    try {
      await Personnel.remove(empId);

      return response.status(204).end();
    } catch (error) {
      return response.status(412).json(error);
    }
  },

  search: async (request, response) => {
    const orgId = request.session.org_id;
    const {query} = request.query;
    try {
      const personnel = await Personnel.search(query, orgId);
      response.status(200).send(personnel);
    } catch (error) {
      console.log(error)
      response.status(400).json(error);
    }
  },

  removeService: async (request, response) => {
    const {serviceId, empId} = request.params;

    try {
      await Personnel.removeService(empId, serviceId);

      return response.status(205).end();
    } catch (error) {
      console.log(error);
      return response.status(412).json(error);
    }
  }
};

const builder = () => {
  let schedule = [];
  let services = [];

  const scheduleBuilder = (body, empId, orgId) => {
    for (let i = 0; i < (body.from).length; i++) {
      let dayObj = {
        organization_id: orgId,
        personnel_id: empId,
        day: i,
        from: body.from[i],
        to: body.to[i]
      };
      schedule.push(dayObj);
    }

    return schedule;
  };

  const servicesBuilder = (body, empId, orgId) => {
    if (Array.isArray(body.service)) {
      (body.service).forEach(service => {
        let serviceObj = {
          organization_id: orgId,
          service_id: service,
          personnel_id: empId
        };
        services.push(serviceObj);
      });
    } else {
      services.push({
        organization_id: orgId,
        service_id: body.service,
        personnel_id: empId
      });
    }

    return services;
  };

  return {
    scheduleBuilder,
    servicesBuilder
  };
}
