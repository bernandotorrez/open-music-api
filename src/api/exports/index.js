const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { ProducerService, playlistsSongsService, validator }) => {
    const exportsHandler = new ExportsHandler(ProducerService, playlistsSongsService, validator);
    server.route(routes(exportsHandler));
  },
};
