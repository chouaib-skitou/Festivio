const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PARTICIPANT,
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  },
  { timestamps: true }
);

userSchema.methods.register = async function register() {
  this.password = await bcrypt.hash(this.password, 12);
  return this.save();
};

userSchema.statics.login = async function login(email, password) {
  const user = await this.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  throw new Error('Invalid email or password');
};

module.exports = mongoose.model('User', userSchema);
