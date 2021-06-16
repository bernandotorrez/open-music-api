const authName = 'songsapp_jwt';

const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: authName,
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: authName,
    },
  },
//   {
//     method: 'GET',
//     path: '/songs/{id}',
//     handler: handler.getSongByIdHandler,
//     options: {
//       auth: authName,
//     },
//   },
//   {
//     method: 'PUT',
//     path: '/songs/{id}',
//     handler: handler.putSongByIdHandler,
//     options: {
//       auth: authName,
//     },
//   },
//   {
//     method: 'DELETE',
//     path: '/songs/{id}',
//     handler: handler.deleteSongByIdHandler,
//     options: {
//       auth: authName,
//     },
//   },
];

module.exports = routes;
