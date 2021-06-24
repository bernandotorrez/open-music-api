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
  }

  async getPlaylistSongsHandler(request, h) {
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
  }

  async deletePlaylistSongByIdHandler(request, h) {
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
  }
}

module.exports = PlaylistSongsHandler;
