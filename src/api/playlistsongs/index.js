const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'PlaylistSongs',
  version: '1.0.0',
  register: async (server, {
    playlistsSongsService, playlistsService, songsService, validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistsSongsService, playlistsService, songsService, validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
