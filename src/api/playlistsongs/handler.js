const ClientError = require('../../exceptions/ClientError');
const ServerError = require('../../exceptions/ServerError');

class PlaylistSongsHandler {
  constructor(playlistsSongsService, songsService, validator) {
    this._service = playlistsSongsService;
    this._validator = validator;
    this._songService = songsService;

    this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongsHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { songId } = request.payload;
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._songService.verifySong(songId);
      await this._service.verifyPlaylistSongAccess({ id, owner: credentialId });

      const playlistsongsId = await this._service.addPlaylistSong({
        playlistId: id, songId,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlistsongsId,
        },
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

  async getPlaylistSongsHandler(request) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;
      await this._service.verifyPlaylistSongAccess({ id, owner: credentialId });
      const songs = await this._service.getPlaylistSongs(id);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        throw new ClientError(error.message, error.statusCode);
      } else {
        throw new ServerError(error.message, error.statusCode);
      }
    }
  }

  async deletePlaylistSongByIdHandler(request) {
    try {
      const { songId } = request.payload;
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._songService.verifySong(songId);
      await this._service.verifyPlaylistSongAccess({ id, owner: credentialId });
      await this._service.deletePlaylistSongById(id, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        throw new ClientError(error.message, error.statusCode);
      } else {
        throw new ServerError(error.message, error.statusCode);
      }
    }
  }
}

module.exports = PlaylistSongsHandler;
