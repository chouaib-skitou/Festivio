// controllers/eventController.js
const Event = require('../models/Event');
const EventDTO = require('../dtos/EventDTO');
const upload = require('../middlewares/uploadMiddleware');

// Create an event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, participants, isOnline, zoomLink, organizer } = req.body;

    console.log('Decoded User:', req.user);
    console.log('Request Body:', req.body);

    // Ensure required fields exist
    if (!req.user) {
      return res.status(403).json({ message: 'User information missing in request' });
    }

    if (!organizer) {
      return res.status(400).json({ message: 'Organizer ID is required' });
    }

    // Role validation
    if (req.user.role !== 'ROLE_ORGANIZER_ADMIN' && req.user.role !== 'ROLE_ADMIN') {
      return res.status(403).json({ message: 'Access denied: Invalid role' });
    }

    // Ensure organizer matches the logged-in user
    if (organizer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Access denied: Organizer ID mismatch' });
    }

    const imagePath = req.file ? `images/${req.file.filename}` : null;

    const event = new Event({
      name,
      description,
      date,
      organizer: req.user.userId,
      participants,
      isOnline,
      zoomLink,
      imagePath,
    });

    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: new EventDTO(event),
    });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Get events
// Get events
exports.getEvents = async (req, res) => {
  try {
    let events;

    // Check user role and fetch events accordingly
    if (req.user.role === 'ROLE_ORGANIZER_ADMIN') {
      // Get events created by the user
      events = await Event.find({ organizer: req.user.userId }).populate('participants tasks');
    } else if (req.user.role === 'ROLE_ADMIN') {
      // Get all events
      events = await Event.find().populate('participants tasks');
    } else if (req.user.role === 'ROLE_PARTICIPANT') {
      // Get events where the user is a participant
      events = await Event.find({ participants: req.user.userId }).populate('participants tasks');
    } else {
      return res.status(403).json({ message: 'Access denied: Invalid role' });
    }

    const eventDTOs = events.map((event) => new EventDTO(event));
    res.status(200).json({ events: eventDTOs });
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date, participants } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.participants = participants || event.participants;

    await event.save();

    res.status(200).json({
      message: 'Event updated successfully',
      event: new EventDTO(event),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Partially update an event
exports.patchEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(event, updates);
    await event.save();

    res.status(200).json({
      message: 'Event partially updated successfully',
      event: new EventDTO(event),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await event.delete();

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
