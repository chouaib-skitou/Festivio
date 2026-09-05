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
const { ROLES } = require('../constants/roles');

const router = express.Router();
const managers = authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN);

router.post('/', authMiddleware, managers, upload.single('image'), createEvent);
router.get('/', authMiddleware, getEvents);
router.put('/:id', authMiddleware, managers, upload.single('image'), updateEvent);
router.patch('/:id', authMiddleware, managers, upload.single('image'), patchEvent);
router.delete('/:id', authMiddleware, managers, deleteEvent);
router.post('/:id/participate', authMiddleware, participateInEvent);
router.post('/:id/unparticipate', authMiddleware, unparticipateEvent);
router.get('/:id', authMiddleware, getEventById);

module.exports = router;
