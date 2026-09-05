const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  resetPassword,
  requestPasswordReset,
} = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiters');
const { issueCsrfToken } = require('../middlewares/csrfMiddleware');

const router = express.Router();

router.get('/csrf-token', issueCsrfToken);

router.post(
  '/register',
  authLimiter,
  [
    check('firstName', 'First name is required').trim().notEmpty(),
    check('lastName', 'Last name is required').trim().notEmpty(),
    check('username', 'Username must contain at least 3 characters')
      .trim()
      .isLength({ min: 3, max: 80 }),
    check('email', 'Please include a valid email').normalizeEmail().isEmail(),
    check('password', 'Password must contain at least 10 characters').isLength({
      min: 10,
      max: 128,
    }),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    check('email', 'Please include a valid email').normalizeEmail().isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/verify-email/:userId/:token', verifyEmail);
router.post(
  '/reset-password-request',
  authLimiter,
  [check('email', 'Please include a valid email').normalizeEmail().isEmail()],
  requestPasswordReset
);
router.post('/reset-password/:token', authLimiter, resetPassword);

module.exports = router;
