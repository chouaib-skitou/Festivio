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
const { ROLES } = require('../constants/roles');

const router = express.Router();
const taskManagers = authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN);

router.post('/', authMiddleware, taskManagers, createTask);
router.get('/', authMiddleware, getAllTasks);
router.put(
  '/:id',
  authMiddleware,
  authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN, ROLES.ORGANIZER),
  updateTask
);
router.patch(
  '/:id',
  authMiddleware,
  authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN, ROLES.ORGANIZER),
  patchTask
);
router.delete('/:id', authMiddleware, taskManagers, deleteTask);

module.exports = router;
