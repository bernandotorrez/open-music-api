const InvariantError = require('../../exceptions/InvariantError');
const { PostCollaborationsPayloadSchema } = require('./schema');

const CollaborationsValidator = {
  validatCollaborationsPayload: (payload) => {
    const validationResult = PostCollaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;