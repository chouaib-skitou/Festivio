const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const ResetPasswordRequest = require('../models/ResetPasswordRequest');
const UserDTO = require('../dtos/UserDTO');
const { config } = require('../config/env');
const { ROLES, PUBLIC_REGISTRATION_ROLES } = require('../constants/roles');
const {
  buildPasswordResetEmail,
  buildVerificationEmail,
} = require('../services/emailTemplates');

const REFRESH_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const generateAccessToken = (userId, role) =>
  jwt.sign({ userId: userId.toString(), role }, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.accessTokenTtl,
  });

const generateRefreshToken = (userId, role) =>
  jwt.sign({ userId: userId.toString(), role }, config.jwtRefreshSecret, {
    algorithm: 'HS256',
    expiresIn: config.refreshTokenTtl,
  });

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: REFRESH_COOKIE_MAX_AGE_MS,
});

const setRefreshCookie = (res, token) => {
  res.cookie(config.refreshCookieName, token, refreshCookieOptions());
};

const clearRefreshCookie = (res) => {
  const options = refreshCookieOptions();
  delete options.maxAge;
  res.clearCookie(config.refreshCookieName, options);
};

const getCookie = (req, name) => {
  const header = req.get('cookie');
  if (!header) return null;

  for (const item of header.split(';')) {
    const separator = item.indexOf('=');
    if (separator === -1) continue;
    const key = item.slice(0, separator).trim();
    if (key === name) {
      return decodeURIComponent(item.slice(separator + 1).trim());
    }
  }

  return null;
};

const createTransporter = () => {
  if (config.smtpHost) {
    const transport = {
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
    };

    if (config.smtpUser && config.smtpPass) {
      transport.auth = { user: config.smtpUser, pass: config.smtpPass };
    }

    return nodemailer.createTransport(transport);
  }

  if (config.smtpUser && config.smtpPass) {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: config.smtpUser, pass: config.smtpPass },
    });
  }

  return null;
};

const sendEmail = async (to, subject, email) => {
  const transporter = createTransporter();
  if (!transporter) {
    if (config.isProduction) {
      throw new Error('Email transport is not configured');
    }
    console.info(`Email skipped in local development: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: config.emailFrom,
    to,
    subject,
    html: email.html,
    text: email.text,
  });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      role = ROLES.PARTICIPANT,
    } = req.body;

    if (!PUBLIC_REGISTRATION_ROLES.has(role)) {
      return res.status(403).json({
        message: 'This role cannot be selected during public registration.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: 'An account already exists for this email.',
      });
    }

    const user = new User({
      firstName,
      lastName,
      username,
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role,
      isVerified: false,
    });
    await user.save();

    const emailToken = jwt.sign(
      { userId: user._id.toString(), purpose: 'verify-email' },
      config.jwtSecret,
      { algorithm: 'HS256', expiresIn: '1d' }
    );
    const verificationLink = `${config.backendUrl}/api/auth/verify-email/${user._id}/${emailToken}`;

    await sendEmail(
      normalizedEmail,
      'Verify your Festivio account',
      buildVerificationEmail({
        firstName: user.firstName,
        verificationLink,
      })
    );

    return res.status(201).json({
      message:
        'Registration successful. Check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration failed:', error.message);
    return res.status(500).json({ message: 'Unable to register account' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
    });

    if (decoded.purpose !== 'verify-email' || decoded.userId !== userId) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    return res.redirect(`${config.frontendUrl}/login?verified=1`);
  } catch (_error) {
    return res
      .status(400)
      .json({ message: 'Invalid or expired verification token' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const normalizedEmail = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      '+password'
    );

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: 'Verify your email before signing in.',
      });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    setRefreshCookie(res, generateRefreshToken(user._id, user.role));

    return res.json({ user: new UserDTO(user), accessToken });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).json({ message: 'Unable to sign in' });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = getCookie(req, config.refreshCookieName);
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh session required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret, {
      algorithms: ['HS256'],
    });
    const user = await User.findById(decoded.userId);

    if (!user || !user.isVerified) {
      clearRefreshCookie(res);
      return res.status(401).json({ message: 'Session is no longer valid' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    setRefreshCookie(res, generateRefreshToken(user._id, user.role));

    return res.json({ user: new UserDTO(user), accessToken });
  } catch (_error) {
    clearRefreshCookie(res);
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

exports.logout = (_req, res) => {
  clearRefreshCookie(res);
  return res.status(204).send();
};

exports.requestPasswordReset = async (req, res) => {
  const genericResponse = {
    message: 'If an account exists for this email, a reset link has been sent.',
  };

  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();
    const user = normalizedEmail
      ? await User.findOne({ email: normalizedEmail })
      : null;

    if (!user) {
      return res.json(genericResponse);
    }

    await ResetPasswordRequest.deleteMany({ userId: user._id });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await ResetPasswordRequest.create({
      tokenHash,
      userId: user._id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetLink = `${config.frontendUrl}/reset-password/${token}`;
    await sendEmail(
      user.email,
      'Reset your Festivio password',
      buildPasswordResetEmail({
        firstName: user.firstName,
        resetLink,
      })
    );

    return res.json(genericResponse);
  } catch (error) {
    console.error('Password reset request failed:', error.message);
    return res
      .status(500)
      .json({ message: 'Unable to process password reset request' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword || newPassword?.length < 10) {
    return res.status(400).json({
      message: 'Passwords must match and contain at least 10 characters.',
    });
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetRequest = await ResetPasswordRequest.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = await User.findById(resetRequest.userId).select('+password');
    if (!user) {
      await ResetPasswordRequest.deleteOne({ _id: resetRequest._id });
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    await ResetPasswordRequest.deleteMany({ userId: user._id });
    clearRefreshCookie(res);

    return res.json({ message: 'Password successfully reset.' });
  } catch (error) {
    console.error('Password reset failed:', error.message);
    return res.status(500).json({ message: 'Unable to reset password' });
  }
};
