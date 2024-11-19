const express = require('express');
const { register, login, updateProfile, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Users
//  *   description: User management and authentication
//  */

// /**
//  * @swagger
//  * /users/register:
//  *   post:
//  *     summary: Register a new user
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               role:
//  *                 type: string
//  *                 enum: [Organizer, Participant]
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  *       400:
//  *         description: Invalid input data
//  */
// router.post('/register', register);

// /**
//  * @swagger
//  * /users/login:
//  *   post:
//  *     summary: Login a user
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Login successful
//  *       400:
//  *         description: Invalid credentials
//  */
// router.post('/login', login);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Organizer, Participant]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 */
router.put('/:id', authMiddleware, updateProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', authMiddleware, getAllUsers);

module.exports = router;
