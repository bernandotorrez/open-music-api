const ClientError = require('../../exceptions/ClientError');
const ServerError = require('../../exceptions/ServerError');

class ExportsHandler {
  constructor(ProducerService, playlistsSongsService, validator) {
    this._service = ProducerService;
    this._validator = validator;
    this._playlistsSongsService = playlistsSongsService;

    this.postExportSongsFromPlaylistHandler = this.postExportSongsFromPlaylistHandler.bind(this);
  }

  async postExportSongsFromPlaylistHandler(request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload);

      const { playlistId } = request.params;
      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._playlistsSongsService.verifyPlaylistSongAccess(playlistId, message.userId);

      await this._service.sendMessage('export:songsPlaylist', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        throw new ClientError(error.message, error.statusCode);
      } else {
        throw new ServerError(error.message, error.statusCode);
      }
    }
  }
}

module.exports = ExportsHandler;
