const authName = 'songsapp_jwt';

const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylistSongsHandler,
    options: {
      auth: authName,
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylistSongsHandler,
    options: {
      auth: authName,
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deletePlaylistSongByIdHandler,
    options: {
      auth: authName,
    },
  },
];

module.exports = routes;
