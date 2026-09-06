const express = require('express');
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  patchEvent,
  participateInEvent,
  unparticipateEvent,
  getEventById,
} = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/uploadMiddleware');
const { readLimiter, uploadLimiter, writeLimiter } = require('../middlewares/rateLimiters');
const { ROLES } = require('../constants/roles');

const router = express.Router();
const managers = authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN);

router.post('/', authMiddleware, managers, uploadLimiter, upload.single('image'), createEvent);
router.get('/', authMiddleware, readLimiter, getEvents);
router.put('/:id', authMiddleware, managers, uploadLimiter, upload.single('image'), updateEvent);
router.patch('/:id', authMiddleware, managers, uploadLimiter, upload.single('image'), patchEvent);
router.delete('/:id', authMiddleware, managers, writeLimiter, deleteEvent);
router.post('/:id/participate', authMiddleware, writeLimiter, participateInEvent);
router.post('/:id/unparticipate', authMiddleware, writeLimiter, unparticipateEvent);
router.get('/:id', authMiddleware, readLimiter, getEventById);

module.exports = router;
