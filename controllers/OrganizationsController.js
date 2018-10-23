'use strict';

const qs = require('querystring');
const moment = require('moment');

const paginator = require('../helpers/pagination');
const Organization = require('../models/organization');
const Packet = require('../models/packet');
const OrgPacket = require('../models/organization_packet');

module.exports = {
  index: async (request, response) => {
    const organizationsQuery = Organization.get();

    const currentPage = request.query.page;

    const user = request.user;
    const role = request.role;

    let created = false;

    if (request.session.created) {
      created = true;
    }

    request.session.created = false;

    try {
      const {result, pagination} = await paginator()(organizationsQuery, {perPage: 10, page: currentPage});

      return response.status(200).render('snippets/pages/organizations/organizations', {
        isAdmin: role.admin,
        organizations: result,
        pages: pagination.lastPage,
        current: pagination.currentPage,
        user: user,
        created: created,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      console.log(error)
      return response.status(412).json(error);
    }
  },

  create: async (request, response) => {
    const user = request.user;
    const role = request.role;

    try {
      const packets = await Packet.get();

      return response.render('snippets/pages/organizations/create', {
        user: user,
        isAdmin: role.admin,
        packets: packets,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {

    }
  },

  // Store new organization
  store: async (request, response) => {
    const body = request.body;

    // For new organization
    const organization = {
      name: body.name,
      address: body.address,
      status: body.status,
      info: body.info
    };

    const packetId = body.packet_id;

    const orgSchedule = [];

    try {
      const orgId = await Organization.save(organization);
      for (let i = 0; i < (body.from).length; i++) {
      let dayObj = {
          organization_id: orgId,
          day: i,
          from: body.from[i],
          to: body.to[i]
        };
        orgSchedule.push(dayObj);
      }

      // Store schedule for new organization
      await Organization.saveOrgSchedule(orgSchedule);

      // For organization_packets update
      const orgPacket = {
        organization_id: orgId,
        packet_id: packetId,
        start_date: new Date().toJSON().slice(0,10).replace(/-/g,'-')
      };

      const orgPacketId = await OrgPacket.save(orgPacket);

      // For update organizations current_packet field
      const orgUpdate = {
        current_packet: orgPacketId
      };

      await Organization.update(orgUpdate, orgId);

      request.session.created = true;

      return response.status(200).end();

    } catch (error) {
      return response.status(412).json(error);
    }
  },

  edit: async (request, response) => {
    const {orgId} = request.params;
    const role = request.role;
    const user = request.user;

    try {
      const org = await Organization.getById(orgId);
      const workDays = await Organization.getOrgSchedule(orgId);
      const orgUsers = await Organization.getOrgUsers(orgId);
      const orgPacket = await Organization.getOrgPacket(orgId);
      const packets = await Packet.get();

      const organization = {
        ...org[0],
        last_payment_date: moment(org[0].last_payment_date).format('YYYY-MM-DD')
      };

      return response.render('snippets/pages/organizations/edit', {
        isAdmin: role.admin,
        organization: organization,
        workDays: workDays,
        orgUsers: orgUsers,
        orgPacket: orgPacket[0],
        packets: packets,
        user: user,
        userOrgs: request.session.userOrgs
      });
    } catch (error) {
      console.log(error)
    }
  },

  update: async (request, response) => {
    const {orgId} = request.params;
    const body = qs.parse(request.body.org);
    const userId = request.body.user_id;
    const role = request.role;

    // For organizations update
    const organizationBody = {
      name: body.name,
      address: body.address,
      info: body.info,
      last_payment_date: body.paydate,
      status: body.status || undefined
    };

    const orgSchedule = [];

    for (let i = 0; i < (body.from).length; i++) {
      let daysObj = {
        organization_id: orgId,
        day: i,
        from: body.from[i],
        to: body.to[i]
      };
      orgSchedule.push(daysObj);
    }

    try {
      if (role.admin) {
        // Organization which will be updated
        const organization = await Organization.getById(orgId);

        // Organization's current packet
        const orgPacket = await OrgPacket.getById(organization[0].current_packet);

        // Organization's packet ID
        const packetId = orgPacket[0].packet_id;

        // Check if admin wants update packet or not
        if (packetId !== parseInt(body.packet_id)) {
          await OrgPacket.update(orgPacket[0].id);

          // For new organization_packet row
          const newOrgPacket = {
            start_date: new Date().toJSON().slice(0,10).replace(/-/g,'-'),
            organization_id: orgId,
            packet_id: body.packet_id
          };

          const orgPacketId = await OrgPacket.save(newOrgPacket);

          organizationBody.current_packet = orgPacketId;
        }

        // Check if admin wants add user to organization or not
        if (userId !== undefined && userId !== '') {
          // For organization_users update
          const orgUser = {
            organization_id: orgId,
            user_id: userId
          };

          await Organization.saveOrgUser(orgUser);
        }
      }

      // Update organization's schedule
      await Organization.updateOrgSchedule(orgSchedule, orgId);

      // Update organization
      await Organization.update(organizationBody, orgId);

      return response.status(200).end();
    } catch (error) {
      console.log(error)
      return response.status(412).json(error);
    }
  },

  // Soft Delete a organization
  delete: async (request, response) => {
    const {orgId} = request.params;

    try {
      await Organization.remove(orgId);

      return response.status(204).end();
    } catch (error) {
      console.log(error)
      return response.status(412).json(error);
    }
  },

  // Remove user from organizan_users table
  removeUser: async (request, response) => {

    const {userId, orgId} = request.params;

    try {
      await Organization.deleteOrgUser(orgId, userId);

      return response.status(205).end();
    } catch (error) {
      console.log(error);
      return response.status(412).json(error);
    }
  },

  search: async (request, response) => {
    console.log('search')
    const {query} = request.query;
    console.log(query);
    try {
      const orgs = await Organization.search(query);
      console.log(orgs)
      response.status(200).send(orgs);
    } catch (error) {
      console.log(error)
      response.status(400).json(error);
    }
  }
};
