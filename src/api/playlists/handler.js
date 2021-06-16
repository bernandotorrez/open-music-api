const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    // this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    // this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    // this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const {
        name,
      } = request.payload;

      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name, owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
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

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    try {
      const playlists = await this._service.getPlaylists({ owner: credentialId });
      return {
        status: 'success',
        data: {
          playlists,
        },
      };
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

  //   async getSongByIdHandler(request, h) {
  //     try {
  //       const { id } = request.params;
  //       const song = await this._service.getSongById(id);
  //       return {
  //         status: 'success',
  //         data: {
  //           song,
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

  //   async putSongByIdHandler(request, h) {
  //     try {
  //       this._validator.validateSongPayload(request.payload);
  //       const { id } = request.params;

  //       await this._service.editSongById(id, request.payload);

  //       return {
  //         status: 'success',
  //         message: 'Lagu berhasil diperbarui',
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

  //   async deleteSongByIdHandler(request, h) {
  //     try {
  //       const { id } = request.params;
  //       await this._service.deleteSongById(id);

  //       return {
  //         status: 'success',
  //         message: 'Lagu berhasil dihapus',
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

module.exports = SongsHandler;
