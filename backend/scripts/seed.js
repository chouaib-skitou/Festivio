const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const { config } = require('../config/env');
const User = require('../models/User');
const Event = require('../models/Event');
const Task = require('../models/Task');
const { ROLES } = require('../constants/roles');

const DEMO_PASSWORD = 'Festivio123!';

const seed = async () => {
  if (config.isProduction) {
    throw new Error('Demo seed is disabled in production');
  }

  await connectDB();
  const password = await bcrypt.hash(DEMO_PASSWORD, 12);
  const definitions = [
    ['Ada', 'Admin', 'admin', 'admin@festivio.local', ROLES.ADMIN],
    ['Morgan', 'Manager', 'manager', 'manager@festivio.local', ROLES.ORGANIZER_ADMIN],
    ['Owen', 'Organizer', 'organizer', 'organizer@festivio.local', ROLES.ORGANIZER],
    ['Pia', 'Participant', 'participant', 'participant@festivio.local', ROLES.PARTICIPANT],
  ];

  const users = {};
  for (const [firstName, lastName, username, email, role] of definitions) {
    users[role] = await User.findOneAndUpdate(
      { email },
      { firstName, lastName, username, email, role, password, isVerified: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await Event.deleteMany({ name: 'Festivio Community Meetup' });
  const event = await Event.create({
    name: 'Festivio Community Meetup',
    description: 'Synthetic local demo event for validating roles, participants and tasks.',
    date: new Date('2027-01-15T18:00:00.000Z'),
    organizer: users[ROLES.ORGANIZER_ADMIN]._id,
    participants: [users[ROLES.PARTICIPANT]._id],
    isOnline: false,
  });

  const task = await Task.create({
    title: 'Prepare attendee check-in',
    description: 'Validate the check-in desk and attendee list before doors open.',
    status: 'In Progress',
    assignedTo: users[ROLES.ORGANIZER]._id,
    event: event._id,
    createdBy: users[ROLES.ORGANIZER_ADMIN]._id,
  });
  event.tasks = [task._id];
  await event.save();

  console.info('Festivio demo data seeded.');
  console.info('Accounts: admin, manager, organizer, participant @festivio.local');
  console.info(`Demo password: ${DEMO_PASSWORD}`);
  await disconnectDB();
};

seed().catch(async (error) => {
  console.error(`Seed failed: ${error.message}`);
  await disconnectDB();
  process.exit(1);
});
