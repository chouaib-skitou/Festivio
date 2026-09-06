const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const { config } = require('../config/env');
const User = require('../models/User');
const Event = require('../models/Event');
const Task = require('../models/Task');
const {
  DEMO_USER_DEFINITIONS,
  LEGACY_DEMO_EVENT_NAMES,
  buildDemoEvents,
} = require('./demoData');

const seed = async () => {
  if (config.isProduction) {
    throw new Error('Demo seed is disabled in production');
  }

  const demoPassword = process.env.DEMO_PASSWORD;
  if (!demoPassword || demoPassword.length < 10) {
    throw new Error('DEMO_PASSWORD with at least 10 characters is required');
  }

  await connectDB();

  try {
    const password = await bcrypt.hash(demoPassword, 12);
    const users = {};

    for (const definition of DEMO_USER_DEFINITIONS) {
      const { key, ...profile } = definition;
      users[key] = await User.findOneAndUpdate(
        { email: profile.email },
        {
          $set: {
            ...profile,
            password,
            isVerified: true,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const eventDefinitions = buildDemoEvents(new Date());
    const demoEventNames = [
      ...LEGACY_DEMO_EVENT_NAMES,
      ...eventDefinitions.map((event) => event.name),
    ];

    const existingDemoEvents = await Event.find({
      name: { $in: demoEventNames },
    }).select('_id');

    const existingDemoEventIds = existingDemoEvents.map((event) => event._id);
    if (existingDemoEventIds.length > 0) {
      await Task.deleteMany({ event: { $in: existingDemoEventIds } });
    }
    await Event.deleteMany({ name: { $in: demoEventNames } });

    const demoEmails = DEMO_USER_DEFINITIONS.map((user) => user.email);
    await User.updateMany(
      { email: { $in: demoEmails } },
      { $set: { events: [], tasks: [] } }
    );

    let taskCount = 0;

    for (const definition of eventDefinitions) {
      const organizer = users[definition.organizerKey];
      if (!organizer) {
        throw new Error(
          `Unknown organizer key "${definition.organizerKey}" for ${definition.name}`
        );
      }

      const participants = definition.participantKeys.map((key) => {
        const participant = users[key];
        if (!participant) {
          throw new Error(`Unknown participant key "${key}" for ${definition.name}`);
        }
        return participant;
      });

      const event = await Event.create({
        name: definition.name,
        description: definition.description,
        date: definition.date,
        organizer: organizer._id,
        participants: participants.map((participant) => participant._id),
        isOnline: definition.isOnline,
        zoomLink: definition.isOnline ? definition.zoomLink : undefined,
        imagePath: definition.imagePath,
      });

      const taskIds = [];
      for (const taskDefinition of definition.tasks) {
        const assignee = users[taskDefinition.assignedToKey];
        if (!assignee) {
          throw new Error(
            `Unknown assignee key "${taskDefinition.assignedToKey}" for ${taskDefinition.title}`
          );
        }

        const task = await Task.create({
          title: taskDefinition.title,
          description: taskDefinition.description,
          status: taskDefinition.status,
          assignedTo: assignee._id,
          event: event._id,
          createdBy: organizer._id,
        });

        taskIds.push(task._id);
        taskCount += 1;

        await User.updateOne(
          { _id: assignee._id },
          { $addToSet: { tasks: task._id } }
        );
      }

      event.tasks = taskIds;
      await event.save();

      await User.updateOne(
        { _id: organizer._id },
        { $addToSet: { events: event._id } }
      );

      if (participants.length > 0) {
        await User.updateMany(
          { _id: { $in: participants.map((participant) => participant._id) } },
          { $addToSet: { events: event._id } }
        );
      }
    }

    console.info('Festivio realistic demo dataset seeded.');
    console.info(
      `Created ${DEMO_USER_DEFINITIONS.length} users, ${eventDefinitions.length} events and ${taskCount} tasks.`
    );
    console.info(`Shared demo password: ${demoPassword}`);
    console.info('Primary accounts:');
    console.info('  admin@festivio.local       (ROLE_ADMIN)');
    console.info('  manager@festivio.local     (ROLE_ORGANIZER_ADMIN)');
    console.info('  organizer@festivio.local   (ROLE_ORGANIZER)');
    console.info('  participant@festivio.local (ROLE_PARTICIPANT)');
  } finally {
    await disconnectDB();
  }
};

seed().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
});
