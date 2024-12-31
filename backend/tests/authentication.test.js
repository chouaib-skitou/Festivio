const request = require('supertest');
const express = require('express');
const { register, login, refreshToken, verifyEmail, resetPassword, requestPasswordReset } = require('../controllers/authController');
const { check } = require('express-validator');
const app = express();
app.use(express.json());

app.post('/api/auth/refresh-token', refreshToken);
app.get('/api/auth/verify-email/:userId/:token', verifyEmail);
app.post('/api/auth/reset-password-request', requestPasswordReset);
app.post('/api/auth/reset-password/:token', resetPassword);

describe('Authentication API', () => {
  let userData;

  beforeEach(() => {
    userData = {
      username: 'testuser',
      email: 'yassinerhourri@gmail.com',
      password: '123456',
      role: 'ROLE_PARTICIPANT',
    };
  });

  describe('POST /api/auth/refresh-token', () => {
    it('should return 401 if no refresh token is provided', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Refresh token required');
    });
  });
  afterAll(async () => {
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  });
});
