const InvariantError = require('../../exceptions/InvariantError');
const { PostPlaylistSongPayloadSchema } = require('./schema');

const PlaylistSongsValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PostPlaylistSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
