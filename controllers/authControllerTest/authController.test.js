const request = require('supertest');
const app = require('../app'); // Asegúrate de importar tu aplicación Express
const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt');

jest.mock('../models/User');
jest.mock('../helpers/jwt');

describe('Auth Controller', () => {
  describe('POST /auth/login', () => {
    it('should return 404 if email not found', async () => {
      User.findOne.mockResolvedValue(null);
      
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toBe(404);
      expect(res.body.msg).toBe('Email no encontrado');
    });

    it('should return 400 if password is invalid', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: '$2a$10$...' }); // Hash de bcrypt
      bcrypt.compareSync = jest.fn().mockReturnValue(false);

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toBe('Contraseña no válida');
    });

    it('should return a token if login is successful', async () => {
      User.findOne.mockResolvedValue({ id: '123', email: 'test@example.com', password: '$2a$10$...' });
      bcrypt.compareSync = jest.fn().mockReturnValue(true);
      generarJWT.mockResolvedValue('fake-jwt-token');

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe('fake-jwt-token');
    });
  });

  // Similar tests for signup, logout, recoverPassword
});
