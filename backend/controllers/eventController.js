const axios = require('axios');
const Event = require('../models/Event');
const EventDTO = require('../dtos/EventDTO');
const { config } = require('../config/env');
const { ROLES } = require('../constants/roles');

const uploadImage = async (file) => {
  if (!file) return null;

  if (!config.imgurClientId) {
    const error = new Error('Image upload is not configured');
    error.status = 503;
    throw error;
  }

  const formData = new FormData();
  formData.append('image', file.buffer.toString('base64'));
  const response = await axios.post('https://api.imgur.com/3/image', formData, {
    headers: { Authorization: `Client-ID ${config.imgurClientId}` },
    timeout: 10000,
  });
  return response.data.data.link;
};

const canManageEvent = (event, user) =>
  user.role === ROLES.ADMIN ||
  (user.role === ROLES.ORGANIZER_ADMIN &&
    event.organizer.toString() === user.userId);

exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, participants, isOnline, zoomLink } = req.body;
    const imagePath = await uploadImage(req.file);
    const normalizedParticipants = Array.isArray(participants)
      ? participants
      : participants
        ? [participants]
        : [];

    const event = await Event.create({
      name,
      description,
      date,
      organizer: req.user.userId,
      participants: normalizedParticipants,
      isOnline: isOnline === true || isOnline === 'true',
      zoomLink: isOnline === true || isOnline === 'true' ? zoomLink : undefined,
      imagePath,
    });

    return res.status(201).json({
      message: 'Event created successfully',
      event: new EventDTO(event),
    });
  } catch (error) {
    console.error('Event creation failed:', error.message);
    return res.status(error.status || 500).json({
      message: error.status === 503 ? error.message : 'Unable to create event',
    });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const filter =
      req.user.role === ROLES.ORGANIZER_ADMIN
        ? { organizer: req.user.userId }
        : {};
    const events = await Event.find(filter)
      .populate('participants', 'firstName lastName email role')
      .populate('tasks')
      .sort({ date: 1 });
    return res.json({ events: events.map((event) => new EventDTO(event)) });
  } catch (error) {
    console.error('Event listing failed:', error.message);
    return res.status(500).json({ message: 'Unable to fetch events' });
  }
};

const applyEventUpdates = (event, body) => {
  const allowedFields = [
    'name',
    'description',
    'date',
    'participants',
    'isOnline',
    'zoomLink',
  ];
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      event[field] = body[field];
    }
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!canManageEvent(event, req.user)) {
      return res.status(403).json({ message: 'You cannot manage this event' });
    }

    applyEventUpdates(event, req.body);
    if (req.file) event.imagePath = await uploadImage(req.file);
    await event.save();
    return res.json({
      message: 'Event updated successfully',
      event: new EventDTO(event),
    });
  } catch (error) {
    console.error('Event update failed:', error.message);
    return res.status(error.status || 500).json({
      message: error.status === 503 ? error.message : 'Unable to update event',
    });
  }
};

exports.patchEvent = exports.updateEvent;

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!canManageEvent(event, req.user)) {
      return res.status(403).json({ message: 'You cannot manage this event' });
    }

    await event.deleteOne();
    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Event deletion failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete event' });
  }
};

exports.participateInEvent = async (req, res) => {
  if (req.user.role !== ROLES.PARTICIPANT) {
    return res.status(403).json({ message: 'Only participants can join events' });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const alreadyJoined = event.participants.some(
      (participantId) => participantId.toString() === req.user.userId
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: 'You already joined this event' });
    }

    event.participants.push(req.user.userId);
    await event.save();
    return res.json({
      message: 'Event joined successfully',
      event: new EventDTO(event),
    });
  } catch (error) {
    console.error('Event participation failed:', error.message);
    return res.status(500).json({ message: 'Unable to join event' });
  }
};

exports.unparticipateEvent = async (req, res) => {
  if (req.user.role !== ROLES.PARTICIPANT) {
    return res.status(403).json({ message: 'Only participants can leave events' });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const before = event.participants.length;
    event.participants = event.participants.filter(
      (participantId) => participantId.toString() !== req.user.userId
    );
    if (event.participants.length === before) {
      return res.status(400).json({ message: 'You are not participating in this event' });
    }

    await event.save();
    return res.json({
      message: 'Event left successfully',
      event: new EventDTO(event),
    });
  } catch (error) {
    console.error('Event leave failed:', error.message);
    return res.status(500).json({ message: 'Unable to leave event' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('participants', 'firstName lastName email role')
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignedTo',
          select: 'firstName lastName email role',
        },
      });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (
      req.user.role === ROLES.ORGANIZER_ADMIN &&
      event.organizer.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: 'You cannot access this event' });
    }

    return res.json({ event: new EventDTO(event) });
  } catch (error) {
    console.error('Event fetch failed:', error.message);
    return res.status(500).json({ message: 'Unable to fetch event' });
  }
};
