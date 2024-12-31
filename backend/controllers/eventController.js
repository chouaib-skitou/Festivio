const axios = require('axios');
const Event = require('../models/Event');
const EventDTO = require('../dtos/EventDTO');

// Upload image to Imgur
const uploadToImgur = async (file) => {
  const formData = new FormData();
  formData.append('image', file.buffer.toString('base64')); // Convert file to base64

  const response = await axios.post('https://api.imgur.com/3/image', formData, {
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, // Use your Client ID from .env
    },
  });

  return response.data.data.link; // Return the Imgur image link
};

// Create an event
exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, participants, isOnline, zoomLink, organizer } = req.body;

    console.log('Decoded User:', req.user);
    console.log('Request Body:', req.body);

    if (!req.user) {
      return res.status(403).json({ message: 'User information missing in request' });
    }

    if (!organizer) {
      return res.status(400).json({ message: 'Organizer ID is required' });
    }

    if (req.user.role !== 'ROLE_ORGANIZER_ADMIN' && req.user.role !== 'ROLE_ADMIN') {
      return res.status(403).json({ message: 'Access denied: Invalid role' });
    }

    if (organizer.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Access denied: Organizer ID mismatch' });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToImgur(req.file);
    }

    const event = new Event({
      name,
      description,
      date,
      organizer: req.user.userId,
      participants,
      isOnline,
      zoomLink,
      imagePath: imageUrl, // Save the Imgur image URL
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
    } else if (req.user.role === 'ROLE_ADMIN' || req.user.role === 'ROLE_PARTICIPANT') {
      // Get all events
      events = await Event.find().populate('participants tasks');
    }  else {
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


// Participate in an event
exports.participateInEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is already a participant
    if (event.participants.includes(req.user.userId)) {
      return res.status(400).json({ message: 'User is already a participant in this event' });
    }

    // Add the user to the participants list
    event.participants.push(req.user.userId);
    await event.save();

    res.status(200).json({ message: 'Successfully added as a participant', event: new EventDTO(event) });
  } catch (error) {
    console.error('Error participating in event:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Unparticipate from an event
exports.unparticipateEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.participants.includes(userId)) {
      return res.status(400).json({ message: 'User is not participating in this event' });
    }

    // Remove user from participants
    event.participants = event.participants.filter(participantId => participantId.toString() !== userId);
    await event.save();

    res.status(200).json({ message: 'Unparticipated successfully', event: event });
  } catch (error) {
    console.error('Error unparticipating from event:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the event by ID and populate tasks and participants
    const event = await Event.findById(id)
      .populate('tasks') // Populate tasks
      .populate('participants'); // Populate participants

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ event: new EventDTO(event) });
  } catch (error) {
    console.error('Error fetching event:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

