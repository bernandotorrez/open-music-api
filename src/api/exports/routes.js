const authName = 'songsapp_jwt';

const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportSongsFromPlaylistHandler,
    options: {
      auth: authName,
    },
  },
];

module.exports = routes;
