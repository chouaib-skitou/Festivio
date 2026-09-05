const mongoose = require('mongoose');
const User = require('../models/User');
const UserDTO = require('../dtos/UserDTO');
const { ROLES } = require('../constants/roles');

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toObjectId = (value) => {
  if (typeof value !== 'string' || !OBJECT_ID_PATTERN.test(value)) return null;
  return new mongoose.Types.ObjectId(value);
};

const normalizeRole = (value) => {
  switch (value) {
    case ROLES.ADMIN:
      return ROLES.ADMIN;
    case ROLES.ORGANIZER_ADMIN:
      return ROLES.ORGANIZER_ADMIN;
    case ROLES.ORGANIZER:
      return ROLES.ORGANIZER;
    case ROLES.PARTICIPANT:
      return ROLES.PARTICIPANT;
    default:
      return null;
  }
};

const normalizeText = (value, maxLength) => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;
  return normalized;
};

exports.updateProfile = async (req, res) => {
  const safeUserId = toObjectId(req.params.id);
  if (!safeUserId) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const isAdmin = req.user.role === ROLES.ADMIN;
  const isSelf = req.user.userId === safeUserId.toString();

  if (!isAdmin && !isSelf) {
    return res
      .status(403)
      .json({ message: 'You can only update your own profile' });
  }

  try {
    const user = await User.findById(safeUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    for (const [field, maxLength] of [
      ['firstName', 100],
      ['lastName', 100],
      ['username', 80],
    ]) {
      if (req.body[field] !== undefined) {
        const normalized = normalizeText(req.body[field], maxLength);
        if (!normalized) {
          return res.status(400).json({ message: `Invalid ${field}` });
        }
        user[field] = normalized;
      }
    }

    if (req.body.email !== undefined) {
      const email = normalizeText(req.body.email, 254)?.toLowerCase();
      if (!email || !EMAIL_PATTERN.test(email)) {
        return res.status(400).json({ message: 'Invalid email' });
      }
      user.email = email;
    }

    if (req.body.role !== undefined) {
      if (!isAdmin) {
        return res.status(403).json({ message: 'Only admins can change roles' });
      }
      const role = normalizeRole(req.body.role);
      if (!role) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      user.role = role;
    }

    await user.save();
    return res.json({
      message: 'User updated successfully',
      user: new UserDTO(user),
    });
  } catch (error) {
    console.error('Profile update failed:', error.message);
    return res.status(500).json({ message: 'Unable to update user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let filter = {};
    if (req.query.role !== undefined) {
      const role = normalizeRole(req.query.role);
      if (!role) {
        return res.status(400).json({ message: 'Invalid role filter' });
      }
      filter = { role };
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    return res.json(users.map((user) => new UserDTO(user)));
  } catch (error) {
    console.error('User listing failed:', error.message);
    return res.status(500).json({ message: 'Unable to fetch users' });
  }
};
