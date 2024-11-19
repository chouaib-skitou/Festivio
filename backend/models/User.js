// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Organizer', 'Participant'], required: false },
  isVerified: { type: Boolean, default: false }, // New field
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Events the user is part of
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],   // Tasks assigned to the user
}, { timestamps: true });


// Register method
userSchema.methods.register = async function () {
  this.password = await bcrypt.hash(this.password, 10);
  return this.save();
};

// Login method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  throw new Error('Invalid email or password');
};

// Update profile method
userSchema.methods.updateProfile = function (updateData) {
  Object.assign(this, updateData);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
