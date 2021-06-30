const authName = 'songsapp_jwt';

const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/notes',
    handler: handler.postExportNotesHandler,
    options: {
      auth: authName,
    },
  },
];

module.exports = routes;
