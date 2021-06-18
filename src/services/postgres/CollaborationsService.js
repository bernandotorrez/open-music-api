const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const BadRequestError = require('../../exceptions/BadRequestError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaborations({ playlistId, userId }) {
    const id = uuidv4();

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

//   async getPlaylistSongs(id) {
//     const query = {
//       text: `select s.id, s.title, s.performer
//       FROM playlistsongs pls
//       INNER JOIN playlists pl ON pl.id = pls.playlist_id
//       INNER JOIN songs s ON s.id = pls.song_id
//       WHERE pls.playlist_id = $1`,
//       values: [id],
//     };
//     const result = await this._pool.query(query);
//     return result.rows;
//   }

//   async deletePlaylistSongById(id, songId) {
//     const query = {
//       text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
//       values: [id, songId],
//     };

//     const result = await this._pool.query(query);

//     if (result.rowCount === 0) {
//       throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
//     }
//   }

  async verifyPlaylistOwner({ id, owner }) {
    const query = {
      text: 'select * from playlists where id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifySong(id) {
    const query = {
      text: 'select * from songs where id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new BadRequestError('Lagu tidak ditemukan');
    }
  }
}

module.exports = CollaborationsService;
