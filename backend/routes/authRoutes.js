<<<<<<< HEAD
const express = require("express");
const {
  register,
  login,
  refreshToken,
  verifyEmail,
} = require("../controllers/authController"); // Import verifyEmail
const { check } = require("express-validator");
=======
const express = require('express');
const { register, login, refreshToken, verifyEmail, resetPassword, requestPasswordReset} = require('../controllers/authController'); // Import verifyEmail
const { check } = require('express-validator');
>>>>>>> 54badae674bd3e8189b1c6b6d20a8ef784ce9b9b

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, invalid input data
 *       500:
 *         description: Internal server error
 */
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  register
);




/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns an access token and refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     description: Refreshes the access token using a refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Refresh token required
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /auth/verify-email/{userId}/{token}:
 *   get:
 *     summary: Verify user email
 *     description: Verifies the user's email address
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */
router.get("/verify-email/:userId/:token", verifyEmail);

/**
 * @swagger
 * /auth/reset-password-request:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a reset password email with a reset link
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/reset-password-request', requestPasswordReset);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using the provided token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or passwords do not match
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/reset-password/:token', resetPassword);

module.exports = router;


