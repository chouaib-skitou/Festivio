// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const UserDTO = require('../dtos/UserDTO'); // Use the correct class name

// Update a user profile
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // Accept role as a query parameter
    const filter = role ? { role } : {};
    const users = await User.find(filter).populate('events tasks').select('-password');
    const userDTOs = users.map((user) => new UserDTO(user)); // Use UserDTO consistently

    res.json(userDTOs);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};





