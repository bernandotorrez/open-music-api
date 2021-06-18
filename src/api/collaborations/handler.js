const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
    // this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    // this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postCollaborationsHandler(request, h) {
    try {
      this._validator.validatCollaborationsPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner({ id: playlistId, owner: credentialId });

      const collaborationId = await this._service.addCollaborations({
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //   async getPlaylistSongsHandler(request, h) {
  //     try {
  //       const { id: credentialId } = request.auth.credentials;
  //       const { id } = request.params;
  //       await this._service.verifyPlaylistOwner({ id, owner: credentialId });
  //       const songs = await this._service.getPlaylistSongs(id);
  //       return {
  //         status: 'success',
  //         data: {
  //           songs,
  //         },
  //       };
  //     } catch (error) {
  //       if (error instanceof ClientError) {
  //         const response = h.response({
  //           status: 'fail',
  //           message: error.message,
  //         });
  //         response.code(error.statusCode);
  //         return response;
  //       }

  //       // Server ERROR!
  //       const response = h.response({
  //         status: 'error',
  //         message: 'Maaf, terjadi kegagalan pada server kami.',
  //       });
  //       response.code(500);
  //       console.error(error);
  //       return response;
  //     }
  //   }

  //   async deletePlaylistSongByIdHandler(request, h) {
  //     try {
  //       const { songId } = request.payload;
  //       const { id } = request.params;
  //       const { id: credentialId } = request.auth.credentials;

  //       await this._service.verifySong(songId);
  //       await this._service.verifyPlaylistOwner({ id, owner: credentialId });
  //       await this._service.deletePlaylistSongById(id, songId);

  //       return {
  //         status: 'success',
  //         message: 'Lagu berhasil dihapus dari playlist',
  //       };
  //     } catch (error) {
  //       if (error instanceof ClientError) {
  //         const response = h.response({
  //           status: 'fail',
  //           message: error.message,
  //         });
  //         response.code(error.statusCode);
  //         return response;
  //       }

//       // Server ERROR!
//       const response = h.response({
//         status: 'error',
//         message: 'Maaf, terjadi kegagalan pada server kami.',
//       });
//       response.code(500);
//       console.error(error);
//       return response;
//     }
//   }
}

module.exports = CollaborationsHandler;
