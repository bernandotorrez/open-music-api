const ClientError = require('../../exceptions/ClientError');
const ServerError = require('../../exceptions/ServerError');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;

      const userId = await this._service.addUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
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

  async getUserByIdHandler(request) {
    try {
      const { id } = request.params;

      const user = await this._service.getUserById(id);

      return {
        status: 'success',
        data: {
          user,
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
}

module.exports = UsersHandler;
