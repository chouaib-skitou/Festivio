const request = require('supertest');
const express = require('express');
const {
  refreshToken,
  verifyEmail,
  resetPassword,
  requestPasswordReset,
} = require('../controllers/authController');

const app = express();
app.use(express.json());

app.post('/api/auth/refresh-token', refreshToken);
app.get('/api/auth/verify-email/:userId/:token', verifyEmail);
app.post('/api/auth/reset-password-request', requestPasswordReset);
app.post('/api/auth/reset-password/:token', resetPassword);

describe('Authentication API', () => {
  describe('POST /api/auth/refresh-token', () => {
    it('returns 401 when no refresh token is provided', async () => {
      const response = await request(app).post('/api/auth/refresh-token').send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Refresh token required');
    });
  });
});
