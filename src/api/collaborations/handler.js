class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._validator = validator;
    this._playlistsService = playlistsService;

    this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationsHandler(request, h) {
    this._validator.validatCollaborationsPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const collaborationId = await this._collaborationsService.addCollaborations({
      playlistId, userId,
    });

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validatCollaborationsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
