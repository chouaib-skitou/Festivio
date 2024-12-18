const request = require('supertest');
const app = require('../app'); // Import your Express app (adjust the path if needed)
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

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(
        'Registration successful. Please check your email to verify your account.'
      );
    });

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

    it('should return 400 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

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

  describe('GET /auth/verify-email/:userId/:token', () => {
    it('should verify the email successfully', async () => {
      // First, register the user
      const response = await request(app).post('/api/auth/register').send(userData);

      const user = await User.findOne({ email: userData.email });
      const emailToken = user._id.toString(); // Use the userId to generate the token

      const verifyResponse = await request(app).get(`/api/auth/verify-email/${user._id}/${emailToken}`);

      expect(verifyResponse.status).toBe(200);
    });

    it('should return 400 if the token is invalid', async () => {
      const response = await request(app).get('/api/auth/verify-email/invalidUserId/invalidToken');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid or expired token');
    });
  });

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

  describe('POST /auth/reset-password/:token', () => {
    it('should reset the password successfully', async () => {
      // Register and request password reset
      await request(app).post('/api/auth/register').send(userData);
      const resetResponse = await request(app)
        .post('/api/auth/reset-password-request')
        .send({ email: userData.email });

      const user = await User.findOne({ email: userData.email });
      const resetToken = resetResponse.body.token; // Simulate received token

      const response = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({
          newPassword: 'newpassword123',
          confirmPassword: 'newpassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password successfully reset. You can now log in with your new password.');
    });

    it('should return 400 if passwords do not match', async () => {
      // Register and request password reset
      await request(app).post('/api/auth/register').send(userData);
      const resetResponse = await request(app)
        .post('/api/auth/reset-password-request')
        .send({ email: userData.email });

      const resetToken = resetResponse.body.token; // Simulate received token

      const response = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({
          newPassword: 'newpassword123',
          confirmPassword: 'differentpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Passwords do not match');
    });
  });
});
