const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addPlaylistSong({ playlistId, songId, owner }) {
    const id = uuidv4();

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    await this._cacheService.delete(`playlistSongs:${owner}`);
    return result.rows[0].id;
  }

  async getPlaylistSongs(id, owner) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._cacheService.get(`playlistSongs:${owner}`);
      return JSON.parse(result);
    } catch (error) {
      // bila gagal, diteruskan dengan mendapatkan catatan dari database
      const query = {
        text: `select s.id, s.title, s.performer
                FROM playlistsongs pls
                INNER JOIN playlists pl ON pl.id = pls.playlist_id
                INNER JOIN songs s ON s.id = pls.song_id
                WHERE pls.playlist_id = $1`,
        values: [id],
      };
      const result = await this._pool.query(query);

      await this._cacheService.set(`playlistSongs:${owner}`, JSON.stringify(result));

      return result.rows;
    }
  }

  async deletePlaylistSongById(id, songId, owner) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [id, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }

    await this._cacheService.delete(`playlistSongs:${owner}`);
  }

  async verifyPlaylistSongOwner({ id, owner }) {
    const query = {
      text: `select *
      from playlists p
      left join collaborations c ON p.id = c.playlist_id
      where p.id = $1 OR c.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];

    if (playlist.owner !== owner && playlist.user_id !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistSongAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistSongOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistSongsService;
