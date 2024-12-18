const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const ResetPasswordRequest = require('../models/ResetPasswordRequest');

// Clear database before each test
/*beforeEach(async () => {
  await User.deleteMany();
  await ResetPasswordRequest.deleteMany();
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
*/
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

      /**
     * Test case to check if an error is returned when trying to register a user with an email that already exists in the system.
     * This test simulates registering the same user twice and expects a 400 status with a relevant message.
     */
  describe('POST /auth/register', () => {
    it('should return 400 if email is already in use', async () => {
      // Register the user first
      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists.');
    });
  });

      /**
     * Test case to verify that a user can log in successfully with correct credentials.
     */
  describe('POST /auth/login', () => {
    it('should log in a user and return tokens', async () => {
      // First, register the user
      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    /**
     * This test ensures that users cannot log in with incorrect email or password.
     */
    it('should return 400 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

      /**
     * Test case to verify that a valid refresh token returns a new access token.
     * This test checks that when a refresh token is provided, a new access token is returned.
     */
  describe('POST /auth/refresh-token', () => {
    it('should return a new access token for valid refresh token', async () => {
      // First, register and log in the user to get refresh token
      const registerResponse = await request(app).post('/api/auth/register').send(userData);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password });

      const refreshToken = loginResponse.body.refreshToken;

      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('should return 401 if no refresh token is provided', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Refresh token required');
    });

    it('should return 403 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalidrefreshToken' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Invalid refresh token');
    });
  });
    /**
     * This test ensures that a password reset link is sent when a registered email is provided.
     */
  describe('POST /auth/reset-password-request', () => {
    it('should send a password reset email if the user exists', async () => {
      // Register the user first
      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/reset-password-request')
        .send({ email: userData.email });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset link sent to your email.');
    });

    it('should return 404 if the user is not found', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password-request')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});
