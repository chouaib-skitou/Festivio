// controllers/eventController.js
const Event = require('../models/Event');
const EventDTO = require('../dtos/EventDTO');

// Create an event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, participants } = req.body;

    // Only organizers can create events
    if (req.user.role !== 'Organizer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const event = new Event({
      name,
      description,
      date,
      organizer: req.user._id,
      participants,
    });

    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: new EventDTO(event),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).populate(
      'participants tasks'
    );
    const eventDTOs = events.map((event) => new EventDTO(event));

    res.status(200).json({ events: eventDTOs });
  } catch (error) {
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
