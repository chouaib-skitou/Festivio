const request = require('supertest');
const express = require('express');
const { register, login, refreshToken, verifyEmail, resetPassword, requestPasswordReset } = require('../controllers/authController');
const { check } = require('express-validator');
const app = express();
app.use(express.json());

// Routes
app.post('/api/auth/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], register);

app.post('/api/auth/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

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
/*
  describe('POST /api/auth/register', () => {
    it('should return 400 if email is already in use', async () => {
      // Mock the database or service call to simulate the user already existing
      const mockCheckUserExists = jest.fn().mockResolvedValue(true); // Simulate that the user already exists in the DB
      const mockRegister = jest.fn().mockImplementation((req, res, next) => {
        if (mockCheckUserExists(req.body.email)) {
          res.status(400).json({ message: 'User already exists.' });
        } else {
          res.status(201).json({ message: 'User created successfully' });
        }
      });

      // Inject the mocked checkUserExists method into the register controller
      register.mockImplementation(mockRegister);

      // Register the user first
      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists.');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in a user and return tokens', async () => {
      // Mock login logic
      const mockLogin = jest.fn().mockResolvedValue({
        token: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        user: { email: userData.email }
      });
      login.mockImplementation(mockLogin);

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
      const mockLogin = jest.fn().mockResolvedValue(null); // Simulate invalid login
      login.mockImplementation(mockLogin);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
*/
  describe('POST /api/auth/refresh-token', () => {
/*
    it('should return a new access token for valid refresh token', async () => {
      // First, register and log in the user to get refresh token
      const mockLogin = jest.fn().mockResolvedValue({
        refreshToken: 'mockRefreshToken'
      });
      login.mockImplementation(mockLogin);

      const registerResponse = await request(app).post('/api/auth/register').send(userData);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password });

      const refreshToken = loginResponse.body.refreshToken;

      const mockRefreshToken = jest.fn().mockResolvedValue({
        accessToken: 'mockAccessToken'
      });
      refreshToken.mockImplementation(mockRefreshToken);

      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });
*/
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
/*
  describe('POST /api/auth/reset-password-request', () => {
    it('should send a password reset email if the user exists', async () => {
      // Mock the password reset request
      const mockPasswordResetRequest = jest.fn().mockResolvedValue({
        message: 'Password reset link sent to your email.'
      });
      requestPasswordReset.mockImplementation(mockPasswordResetRequest);

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
*/
  afterAll(async () => {
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  });
});
