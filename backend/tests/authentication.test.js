const request = require('supertest');
const express = require('express');
const { refreshToken, logout } = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiters');

const app = express();
app.use(express.json());
app.post('/api/auth/refresh-token', authLimiter, refreshToken);
app.post('/api/auth/logout', authLimiter, logout);

describe('Authentication session API', () => {
  it('returns 401 when no HttpOnly refresh cookie is provided', async () => {
    const response = await request(app).post('/api/auth/refresh-token').send();
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Refresh session required');
  });

  it('clears the refresh cookie on logout', async () => {
    const response = await request(app).post('/api/auth/logout').send();
    expect(response.status).toBe(204);
    expect(response.headers['set-cookie'][0]).toContain('festivio_refresh=;');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
  });
});
