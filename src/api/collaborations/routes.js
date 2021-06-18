const authName = 'songsapp_jwt';

const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationsHandler,
    options: {
      auth: authName,
    },
  },
//   {
//     method: 'PUT',
//     path: '/authentications',
//     handler: handler.putAuthenticationHandler,
//   },
//   {
//     method: 'DELETE',
//     path: '/authentications',
//     handler: handler.deleteAuthenticationHandler,
//   },
];

module.exports = routes;
