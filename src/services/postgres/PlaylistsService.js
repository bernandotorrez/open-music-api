const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { playlistMapDBToModel } = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({
    name, owner,
  }) {
    const id = uuidv4();

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists({ owner }) {
    const query = {
      text: `SELECT p.*, u.username
      FROM playlists p
      LEFT JOIN users u ON u.id = p.owner
      WHERE p.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(playlistMapDBToModel);
  }

  // async getSongById(id) {
  //   const query = {
  //     text: 'SELECT * FROM songs WHERE id = $1',
  //     values: [id],
  //   };
  //   const result = await this._pool.query(query);

  //   if (result.rowCount === 0) {
  //     throw new NotFoundError('Lagu tidak ditemukan');
  //   }

  //   return result.rows.map(songMapDBToModel)[0];
  // }

  // async editSongById(id, {
  //   title, year, performer, genre, duration,
  // }) {
  //   const updatedAt = new Date().toISOString();
  //   const query = {
  //     text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
  //     values: [title, year, performer, genre, duration, updatedAt, id],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rows.length) {
  //     throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
  //   }
  // }

  // async deleteSongById(id) {
  //   const query = {
  //     text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
  //     values: [id],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rows.length) {
  //     throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
  //   }
  // }

  // async verifyPlaylistOwner(id, owner) {
  //   const query = {
  //     text: 'SELECT * FROM playlists WHERE id = $1',
  //     values: [id],
  //   };
  //   const result = await this._pool.query(query);
  //   if (result.rowCount === 0) {
  //     throw new NotFoundError('Playlist tidak ditemukan');
  //   }
  //   const playlist = result.rows[0];
  //   if (playlist.owner !== owner) {
  //     throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  //   }
  // }

  // async verifyPlaylistAccess(songId, userId) {
  //   try {
  //     await this.verifyPlaylistOwner(songId, userId);
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       throw error;
  //     }
  //     try {
  //       await this._collaborationService.verifyCollaborator(noteId, userId);
  //     } catch {
  //       throw error;
  //     }
  //   }
  // }

  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
