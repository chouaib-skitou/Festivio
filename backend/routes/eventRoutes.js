const express = require('express');
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  patchEvent,
  participateInEvent,
  unparticipateEvent,
  getEventById
} = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API for managing events
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: Create an event. Only organizers can perform this action.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Event name
 *               description:
 *                 type: string
 *                 description: Event description
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Event date
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: User IDs of participants
 *     responses:
 *       201:
 *         description: Event created successfully
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, upload.single('image'), createEvent);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve all events created by the logged-in organizer.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved events
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, getEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     description: Update the details of an existing event. Only the organizer can perform this action.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     summary: Partially update an event
 *     description: Update specific fields of an event. Only the organizer can perform this action.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', authMiddleware, patchEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event. Only the organizer can perform this action.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, deleteEvent);

/**
 * @swagger
 * /api/events/{id}/participate:
 *   post:
 *     summary: Participate in an event
 *     description: Adds the logged-in user as a participant to the specified event.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Successfully added the user as a participant
 *       404:
 *         description: Event not found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post('/:id/participate', authMiddleware, participateInEvent);

/**
 * @swagger
 * /api/events/{id}/unparticipate:
 *   post:
 *     summary: Unparticipate from an event
 *     description: Remove the logged-in user from the participants of the event.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Unparticipated successfully
 *       404:
 *         description: Event not found
 *       400:
 *         description: User not participating
 *       500:
 *         description: Server error
 */
router.post('/:id/unparticipate', authMiddleware, unparticipateEvent);


/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Fetch details of a single event by its ID.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, getEventById);




module.exports = router;
