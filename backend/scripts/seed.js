const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');
const { config } = require('../config/env');
const User = require('../models/User');
const Event = require('../models/Event');
const Task = require('../models/Task');
const { ROLES } = require('../constants/roles');

const user = (key, firstName, lastName, role) => ({
  key,
  firstName,
  lastName,
  username: key,
  email: `${key}@festivio.local`,
  role,
});

const demoUsers = [
  user('admin', 'Ada', 'Martin', ROLES.ADMIN),
  user('manager', 'Morgan', 'Lefevre', ROLES.ORGANIZER_ADMIN),
  user('lea', 'Lea', 'Dubois', ROLES.ORGANIZER_ADMIN),
  user('karim', 'Karim', 'Benali', ROLES.ORGANIZER_ADMIN),
  user('organizer', 'Owen', 'Mercier', ROLES.ORGANIZER),
  user('sofia', 'Sofia', 'Garcia', ROLES.ORGANIZER),
  user('lucas', 'Lucas', 'Bernard', ROLES.ORGANIZER),
  user('emma', 'Emma', 'Roux', ROLES.ORGANIZER),
  user('noah', 'Noah', 'Laurent', ROLES.ORGANIZER),
  user('participant', 'Pia', 'Robert', ROLES.PARTICIPANT),
  user('camille', 'Camille', 'Moreau', ROLES.PARTICIPANT),
  user('hugo', 'Hugo', 'Petit', ROLES.PARTICIPANT),
  user('sarah', 'Sarah', 'Cohen', ROLES.PARTICIPANT),
  user('mehdi', 'Mehdi', 'Alaoui', ROLES.PARTICIPANT),
  user('lina', 'Lina', 'Fournier', ROLES.PARTICIPANT),
  user('thomas', 'Thomas', 'Leroy', ROLES.PARTICIPANT),
  user('ines', 'Ines', 'Martinez', ROLES.PARTICIPANT),
  user('julien', 'Julien', 'Nguyen', ROLES.PARTICIPANT),
];

const addDays = (baseDate, days, hour = 18, minute = 0) => {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
};

const task = (title, status, assignedToKey) => ({
  title,
  status,
  assignedToKey,
  description: `${title}. Confirm owners, timing, risks and handoff notes so the event team can execute without ambiguity.`,
});

const buildEvents = (baseDate = new Date()) => [
  {
    name: 'Paris Product & Design Summit 2026',
    description: 'A full-day conference for product managers, designers and engineering leaders with a keynote, practical tracks, customer research roundtables, hosted lunch and an evening networking reception.',
    date: addDays(baseDate, 18, 8),
    organizerKey: 'manager',
    participantKeys: ['participant', 'camille', 'hugo', 'sarah', 'mehdi', 'lina'],
    isOnline: false,
    imagePath: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Confirm keynote speaker arrival', 'Completed', 'organizer'),
      task('Finalize catering headcount and dietary notes', 'In Progress', 'sofia'),
      task('Prepare attendee check-in stations', 'Pending', 'lucas'),
      task('Run main-stage AV rehearsal', 'Pending', 'emma'),
      task('Schedule final attendee briefing email', 'In Progress', 'noah'),
    ],
  },
  {
    name: 'Remote Engineering Leadership Forum',
    description: 'A live online forum for engineering managers and staff engineers covering incident leadership, architecture decisions, healthy on-call practices and career frameworks.',
    date: addDays(baseDate, 7, 16),
    organizerKey: 'karim',
    participantKeys: ['participant', 'hugo', 'sarah', 'thomas', 'julien'],
    isOnline: true,
    zoomLink: 'https://zoom.us/j/00000000001',
    imagePath: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Collect final speaker slide decks', 'Completed', 'emma'),
      task('Moderate breakout room assignments', 'In Progress', 'noah'),
      task('Run streaming and recording rehearsal', 'Pending', 'lucas'),
      task('Prepare live Q&A moderation sheet', 'Pending', 'organizer'),
    ],
  },
  {
    name: 'Green Cities Community Night',
    description: 'An evening event bringing together urban planners, climate startups, mobility teams and local associations for short talks, project booths and networking.',
    date: addDays(baseDate, 32, 18),
    organizerKey: 'lea',
    participantKeys: ['camille', 'sarah', 'mehdi', 'lina', 'ines', 'julien'],
    isOnline: false,
    imagePath: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Confirm community partner booths', 'In Progress', 'sofia'),
      task('Prepare zero-waste catering plan', 'Pending', 'emma'),
      task('Coordinate speaker arrival and mic checks', 'Pending', 'lucas'),
      task('Publish neighborhood access guide', 'Completed', 'noah'),
    ],
  },
  {
    name: 'Open Source Maintainers Meetup',
    description: 'A focused meetup for maintainers and contributors comparing release workflows, contributor onboarding, vulnerability disclosure and sustainable project governance.',
    date: addDays(baseDate, -12, 18),
    organizerKey: 'karim',
    participantKeys: ['participant', 'hugo', 'mehdi', 'thomas', 'julien'],
    isOnline: false,
    imagePath: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Prepare contributor welcome desk', 'Completed', 'organizer'),
      task('Capture lightning talk recordings', 'Completed', 'lucas'),
      task('Send post-event resource pack', 'Completed', 'emma'),
      task('Review attendee feedback themes', 'In Progress', 'noah'),
    ],
  },
  {
    name: 'Indie Makers Demo Evening',
    description: 'A demo night where independent builders and early-stage founders present working products, receive audience questions and meet potential collaborators.',
    date: addDays(baseDate, 45, 18),
    organizerKey: 'manager',
    participantKeys: ['participant', 'camille', 'hugo', 'lina', 'thomas', 'ines'],
    isOnline: false,
    imagePath: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Finalize twelve-team demo order', 'In Progress', 'organizer'),
      task('Validate demo laptop and adapter kit', 'Pending', 'lucas'),
      task('Prepare founder check-in packs', 'Pending', 'sofia'),
      task('Coordinate audience voting flow', 'Pending', 'emma'),
      task('Schedule social recap assets', 'Pending', 'noah'),
    ],
  },
  {
    name: 'Data & AI for Operations Workshop',
    description: 'A practical online workshop for operations and platform teams exploring AI-assisted incident triage, knowledge retrieval, workflow orchestration, evaluation and human review.',
    date: addDays(baseDate, 21, 13),
    organizerKey: 'lea',
    participantKeys: ['sarah', 'mehdi', 'lina', 'thomas', 'julien'],
    isOnline: true,
    zoomLink: 'https://zoom.us/j/00000000002',
    imagePath: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Publish workshop preparation guide', 'Completed', 'emma'),
      task('Validate exercise datasets', 'In Progress', 'organizer'),
      task('Prepare facilitator breakout rooms', 'Pending', 'noah'),
      task('Test screen-sharing fallback plan', 'Pending', 'lucas'),
    ],
  },
  {
    name: 'Bright Futures Fundraising Gala',
    description: 'A fundraising gala supporting digital inclusion programs, with a welcome reception, beneficiary stories, seated dinner, live auction and closing music set.',
    date: addDays(baseDate, 68, 19),
    organizerKey: 'lea',
    participantKeys: ['camille', 'sarah', 'mehdi', 'lina', 'thomas', 'ines'],
    isOnline: false,
    imagePath: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Finalize donor seating plan', 'In Progress', 'sofia'),
      task('Prepare live auction runbook', 'Pending', 'organizer'),
      task('Coordinate beneficiary speaker support', 'Pending', 'emma'),
      task('Validate donation payment stations', 'Pending', 'lucas'),
      task('Prepare volunteer briefing packs', 'Pending', 'noah'),
    ],
  },
  {
    name: 'Customer Community Breakfast',
    description: 'A small-format breakfast for customer success, product and community leaders using facilitated roundtables and a practical working session.',
    date: addDays(baseDate, 3, 8),
    organizerKey: 'karim',
    participantKeys: ['participant', 'camille', 'sarah', 'thomas'],
    isOnline: false,
    imagePath: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Confirm roundtable host assignments', 'Completed', 'organizer'),
      task('Review final breakfast order', 'In Progress', 'sofia'),
      task('Print working-session templates', 'Pending', 'emma'),
      task('Prepare venue opening checklist', 'Pending', 'lucas'),
    ],
  },
  {
    name: 'Security Incident Tabletop Exercise',
    description: 'A private online tabletop exercise simulating a credential leak, suspicious access and partial service degradation, followed by a structured retrospective.',
    date: addDays(baseDate, 12, 14),
    organizerKey: 'karim',
    participantKeys: ['hugo', 'mehdi', 'thomas', 'julien'],
    isOnline: true,
    zoomLink: 'https://zoom.us/j/00000000003',
    imagePath: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Validate incident scenario timeline', 'Completed', 'organizer'),
      task('Prepare observer note template', 'In Progress', 'noah'),
      task('Test private exercise room access', 'Pending', 'lucas'),
      task('Prepare retrospective action log', 'Pending', 'emma'),
    ],
  },
];

const demoEventNames = (events) => [
  'Festivio Community Meetup',
  ...events.map((event) => event.name),
];

const removeExistingDemoData = async (events) => {
  for (const name of demoEventNames(events)) {
    const matches = await Event.find({ name }).select('_id');
    for (const match of matches) {
      await Task.deleteMany({ event: match._id });
    }
    await Event.deleteMany({ name });
  }

  for (const demoUser of demoUsers) {
    await User.updateOne(
      { email: demoUser.email },
      { $set: { events: [], tasks: [] } }
    );
  }
};

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

    for (const definition of demoUsers) {
      const { key, ...profile } = definition;
      users[key] = await User.findOneAndUpdate(
        { email: profile.email },
        { $set: { ...profile, password, isVerified: true } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const events = buildEvents(new Date());
    await removeExistingDemoData(events);

    let taskCount = 0;

    for (const definition of events) {
      const organizer = users[definition.organizerKey];
      if (!organizer) throw new Error(`Unknown organizer key ${definition.organizerKey}`);

      const participants = definition.participantKeys.map((key) => {
        const participant = users[key];
        if (!participant) throw new Error(`Unknown participant key ${key}`);
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
        if (!assignee) throw new Error(`Unknown assignee key ${taskDefinition.assignedToKey}`);

        const createdTask = await Task.create({
          title: taskDefinition.title,
          description: taskDefinition.description,
          status: taskDefinition.status,
          assignedTo: assignee._id,
          event: event._id,
          createdBy: organizer._id,
        });

        taskIds.push(createdTask._id);
        taskCount += 1;

        await User.updateOne(
          { _id: assignee._id },
          { $addToSet: { tasks: createdTask._id } }
        );
      }

      event.tasks = taskIds;
      await event.save();

      await User.updateOne(
        { _id: organizer._id },
        { $addToSet: { events: event._id } }
      );

      for (const participant of participants) {
        await User.updateOne(
          { _id: participant._id },
          { $addToSet: { events: event._id } }
        );
      }
    }

    console.info('Festivio realistic demo dataset seeded.');
    console.info(`Created ${demoUsers.length} users, ${events.length} events and ${taskCount} tasks.`);
    console.info('Demo accounts use the configured DEMO_PASSWORD value.');
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
