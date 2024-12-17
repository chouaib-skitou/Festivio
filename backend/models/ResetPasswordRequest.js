const mongoose = require('mongoose');

const resetPasswordRequestSchema = new mongoose.Schema({
  token: { type: String, required: true }, // The reset token
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  expiresAt: { type: Date, required: true }, // Token expiration time
});

module.exports = mongoose.model('ResetPasswordRequest', resetPasswordRequestSchema);
