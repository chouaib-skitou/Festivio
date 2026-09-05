const express = require('express');
const { updateProfile, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.put('/:id', authMiddleware, updateProfile);
router.get(
  '/',
  authMiddleware,
  authorize(ROLES.ADMIN, ROLES.ORGANIZER_ADMIN),
  getAllUsers
);

module.exports = router;
