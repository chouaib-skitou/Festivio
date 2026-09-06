const express = require('express');
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  patchTask,
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const { readLimiter, writeLimiter } = require('../middlewares/rateLimiters');
const { ROLES } = require('../constants/roles');

const router = express.Router();
const taskManagers = authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN);

router.post('/', authMiddleware, taskManagers, writeLimiter, createTask);
router.get('/', authMiddleware, readLimiter, getAllTasks);
router.put(
  '/:id',
  authMiddleware,
  authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN, ROLES.ORGANIZER),
  writeLimiter,
  updateTask
);
router.patch(
  '/:id',
  authMiddleware,
  authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN, ROLES.ORGANIZER),
  writeLimiter,
  patchTask
);
router.delete('/:id', authMiddleware, taskManagers, writeLimiter, deleteTask);

module.exports = router;
