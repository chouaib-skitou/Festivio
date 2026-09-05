const User = require('../models/User');
const UserDTO = require('../dtos/UserDTO');
const { ROLES } = require('../constants/roles');

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.role === ROLES.ADMIN;
  const isSelf = req.user.userId === id;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: 'You can only update your own profile' });
  }

  try {
    const allowedUpdates = {};
    for (const field of ['firstName', 'lastName', 'username', 'email']) {
      if (req.body[field] !== undefined) {
        allowedUpdates[field] = req.body[field];
      }
    }

    if (isAdmin && req.body.role !== undefined) {
      if (!Object.values(ROLES).includes(req.body.role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      allowedUpdates.role = req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'User updated successfully',
      user: new UserDTO(updatedUser),
    });
  } catch (error) {
    console.error('Profile update failed:', error.message);
    return res.status(500).json({ message: 'Unable to update user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) {
      if (!Object.values(ROLES).includes(req.query.role)) {
        return res.status(400).json({ message: 'Invalid role filter' });
      }
      filter.role = req.query.role;
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    return res.json(users.map((user) => new UserDTO(user)));
  } catch (error) {
    console.error('User listing failed:', error.message);
    return res.status(500).json({ message: 'Unable to fetch users' });
  }
};
