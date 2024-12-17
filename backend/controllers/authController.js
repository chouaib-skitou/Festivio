// controllers/authController.js
const User = require('../models/User');
const ResetPasswordRequest = require('../models/ResetPasswordRequest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const UserDTO = require('../dtos/UserDTO');

// Helper functions to generate tokens
const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

const generateEmailToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

// Helper to send email
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

// Register User
exports.register = async (req, res) => {
  

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        return res.status(400).json({
          message: 'User already exists but email is not verified. Please verify your email.',
        });
      }
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    await user.save();
    console.log('User saved to database:', user);

    // Generate email verification token
    const emailToken = generateEmailToken(user._id);
    const verificationLink = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${user._id}/${emailToken}`;
    console.log('Verification link:', verificationLink);

    console.log('Received userId:', user._id);
    console.log('Received token:', emailToken);

    // Send verification email
    await sendEmail(
      email,
      'Verify Your Email',
      `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    );

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (err) { // Ensure "err" is used here
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Verify Email
exports.verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    console.log('Token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    if (decoded.userId !== userId) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    user.isVerified = true;
    console.log('User verified:', user);
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/login`); // Redirect to login page after verification
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Login User
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate tokens
    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({ user: new UserDTO(user), token, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh Token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const accessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken, refreshToken });
  });
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate reset token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save the reset token in ResetPasswordRequest
    await ResetPasswordRequest.create({
      token,
      userId: user._id,
      expiresAt: Date.now() + 3600000, // 1 hour expiry
    });

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}reset-password/${token}`;
    await sendEmail(
      email,
      'Reset Your Password',
      `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    );

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params; // Extract token from URL
  const { newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Find the reset password request by token
    const resetRequest = await ResetPasswordRequest.findOne({ token });
    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (resetRequest.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    // Find the user by ID
    const user = await User.findById(resetRequest.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the reset password request
    await ResetPasswordRequest.deleteOne({ _id: resetRequest._id });

    res.json({ message: 'Password successfully reset. You can now log in with your new password.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};