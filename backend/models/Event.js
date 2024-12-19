const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    isOnline: { type: Boolean, default: false },
    zoomLink: { type: String },
    imagePath: { type: String }, // Store image URL or path
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
