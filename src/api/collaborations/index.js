const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Collaborations',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(service, validator);
    server.route(routes(collaborationsHandler));
  },
};
