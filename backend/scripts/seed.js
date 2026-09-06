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

const DEMO_USER_DEFINITIONS = [
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

const LEGACY_DEMO_EVENT_NAMES = ['Festivio Community Meetup'];

const relativeDate = (baseDate, days, hour = 18, minute = 0) => {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
};

const task = (title, description, status, assignedToKey) => ({
  title,
  description,
  status,
  assignedToKey,
});

const buildDemoEvents = (baseDate = new Date()) => [
  {
    name: 'Paris Product & Design Summit 2026',
    description:
      'A full-day conference for product managers, designers and engineering leaders. The agenda includes a keynote, practical tracks, customer research roundtables, hosted lunch and an evening networking reception.',
    date: relativeDate(baseDate, 18, 8),
    organizerKey: 'manager',
    participantKeys: ['participant', 'camille', 'hugo', 'sarah', 'mehdi', 'lina'],
    isOnline: false,
    imagePath:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Confirm keynote speaker arrival', 'Confirm arrival, hotel check-in, green room access and pre-stage briefing.', 'Completed', 'organizer'),
      task('Finalize catering headcount', 'Send final guest count and dietary requirements to the caterer.', 'In Progress', 'sofia'),
      task('Prepare attendee check-in stations', 'Prepare laptops, badge stock, backup lists and the speaker fast lane.', 'Pending', 'lucas'),
      task('Run main-stage AV rehearsal', 'Test microphones, presentation switching, lighting and backup playback.', 'Pending', 'emma'),
      task('Schedule attendee briefing email', 'Send arrival instructions, transport guidance and final agenda highlights.', 'In Progress', 'noah'),
    ],
  },
  {
    name: 'Remote Engineering Leadership Forum',
    description:
      'A live online forum for engineering managers and staff engineers covering incident leadership, architecture decisions, healthy on-call practices and career frameworks.',
    date: relativeDate(baseDate, 7, 16),
    organizerKey: 'karim',
    participantKeys: ['participant', 'hugo', 'sarah', 'thomas', 'julien'],
    isOnline: true,
    zoomLink: 'https://zoom.us/j/00000000001',
    imagePath:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Collect final speaker decks', 'Collect files, verify media and keep local backups.', 'Completed', 'emma'),
      task('Assign breakout rooms', 'Prepare balanced peer groups and moderator ownership.', 'In Progress', 'noah'),
      task('Run streaming rehearsal', 'Validate screen sharing, recording, waiting room and backup host permissions.', 'Pending', 'lucas'),
      task('Prepare Q&A moderation sheet', 'Prepare seeded questions, speaker ownership and timing guidance.', 'Pending', 'organizer'),
    ],
  },
  {
    name: 'Green Cities Community Night',
    description:
      'An evening event bringing together urban planners, climate startups, mobility teams and local associations for short talks, project booths and networking.',
    date: relativeDate(baseDate, 32, 18),
    organizerKey: 'lea',
    participantKeys: ['camille', 'sarah', 'mehdi', 'lina', 'ines', 'julien'],
    isOnline: false,
    imagePath:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Confirm partner booths', 'Confirm table dimensions, power needs and arrival times.', 'In Progress', 'sofia'),
      task('Prepare zero-waste catering plan', 'Review reusable serviceware, collection points and food donation options.', 'Pending', 'emma'),
      task('Coordinate speaker mic checks', 'Schedule speaker arrival windows and sound checks.', 'Pending', 'lucas'),
      task('Publish low-carbon access guide', 'Publish metro, cycling, walking and accessibility information.', 'Completed', 'noah'),
    ],
  },
  {
    name: 'Open Source Maintainers Meetup',
    description:
      'A focused meetup for maintainers and contributors comparing release workflows, contributor onboarding, vulnerability disclosure and sustainable project governance.',
    date: relativeDate(baseDate, -12, 18),
    organizerKey: 'karim',
    participantKeys: ['participant', 'hugo', 'mehdi', 'thomas', 'julien'],
    isOnline: false,
    imagePath:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Prepare contributor welcome desk', 'Set up badges, project stickers and first-contribution guides.', 'Completed', 'organizer'),
      task('Capture lightning talk recordings', 'Record talks, label files and archive approved recordings.', 'Completed', 'lucas'),
      task('Send post-event resource pack', 'Send presentations, project links and the feedback form.', 'Completed', 'emma'),
      task('Review attendee feedback', 'Summarize recurring feedback and recommendations for the next edition.', 'In Progress', 'noah'),
    ],
  },
  {
    name: 'Indie Makers Demo Evening',
    description:
      'A fast-paced demo night where independent builders and early-stage founders present working products, receive audience questions and meet collaborators.',
    date: relativeDate(baseDate, 45, 18),
    organizerKey: 'manager',
    participantKeys: ['participant', 'camille', 'hugo', 'lina', 'thomas', 'ines'],
    isOnline: false,
    imagePath:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Finalize demo order', 'Lock the demo order according to setup requirements.', 'In Progress', 'organizer'),
      task('Validate adapter and laptop kit', 'Test HDMI, USB-C adapters, guest Wi-Fi and backup laptop.', 'Pending', 'lucas'),
      task('Prepare founder check-in packs', 'Prepare badges, demo order cards and Wi-Fi instructions.', 'Pending', 'sofia'),
      task('Test audience voting', 'Validate QR voting and prepare a manual fallback tally.', 'Pending', 'emma'),
      task('Prepare social recap', 'Prepare the photo shot list and winner announcement assets.', 'Pending', 'noah'),
    ],
  },
  {
    name: 'Data & AI for Operations Workshop',
    description:
      'A practical online workshop for operations and platform teams exploring AI-assisted triage, knowledge retrieval, workflow orchestration, evaluation and human review.',
    date: relativeDate(baseDate, 21, 13),
    organizerKey: 'lea',
    participantKeys: ['sarah', 'mehdi', 'lina', 'thomas', 'julien'],
    isOnline: true,
    zoomLink: 'https://zoom.us/j/00000000002',
    imagePath:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Publish preparation guide', 'Send environment requirements, sample data and pre-reading list.', 'Completed', 'emma'),
      task('Validate exercise datasets', 'Run every workshop exercise against final synthetic datasets.', 'In Progress', 'organizer'),
      task('Prepare facilitator rooms', 'Assign facilitators, timings and expected outputs.', 'Pending', 'noah'),
      task('Test fallback conference setup', 'Validate backup host access and downloadable exercise files.', 'Pending', 'lucas'),
    ],
  },
  {
    name: 'Bright Futures Fundraising Gala',
    description:
      'A fundraising gala supporting digital inclusion programs, with a welcome reception, beneficiary stories, seated dinner, live auction and closing music set.',
    date: relativeDate(baseDate, 68, 19),
    organizerKey: 'lea',
    participantKeys: ['camille', 'sarah', 'mehdi', 'lina', 'thomas', 'ines'],
    isOnline: false,
    imagePath:
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Finalize donor seating plan', 'Reconcile table hosts, accessibility needs and late RSVP changes.', 'In Progress', 'sofia'),
      task('Prepare live auction runbook', 'Document auction order, bidder capture and payment handoff.', 'Pending', 'organizer'),
      task('Coordinate beneficiary speakers', 'Confirm transport, arrival, support and stage rehearsal.', 'Pending', 'emma'),
      task('Validate payment stations', 'Test card readers, receipts and backup connectivity.', 'Pending', 'lucas'),
      task('Prepare volunteer briefing packs', 'Prepare role cards, floor map and escalation contacts.', 'Pending', 'noah'),
    ],
  },
  {
    name: 'Customer Community Breakfast',
    description:
      'A small-format breakfast for customer success, product and community leaders using facilitated roundtables and a practical working session.',
    date: relativeDate(baseDate, 3, 8),
    organizerKey: 'karim',
    participantKeys: ['participant', 'camille', 'sarah', 'thomas'],
    isOnline: false,
    imagePath:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Confirm roundtable hosts', 'Match each topic with an experienced host and send the discussion guide.', 'Completed', 'organizer'),
      task('Review breakfast order', 'Confirm coffee, pastries, fruit and dietary alternatives.', 'In Progress', 'sofia'),
      task('Print working templates', 'Print experiment canvases and table signage.', 'Pending', 'emma'),
      task('Prepare venue opening checklist', 'Document room setup, check-in and signage checks.', 'Pending', 'lucas'),
    ],
  },
  {
    name: 'Security Incident Tabletop Exercise',
    description:
      'A private online tabletop exercise simulating a credential leak, suspicious access and partial service degradation, followed by a structured retrospective.',
    date: relativeDate(baseDate, 12, 14),
    organizerKey: 'karim',
    participantKeys: ['hugo', 'mehdi', 'thomas', 'julien'],
    isOnline: true,
    zoomLink: 'https://zoom.us/j/00000000003',
    imagePath:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80',
    tasks: [
      task('Validate incident timeline', 'Review scenario injects, decision points and dependencies.', 'Completed', 'organizer'),
      task('Prepare observer template', 'Create a structured sheet covering detection, ownership and recovery.', 'In Progress', 'noah'),
      task('Test private room access', 'Verify meeting access controls and backup host permissions.', 'Pending', 'lucas'),
      task('Prepare retrospective action log', 'Create the action tracker with owner, severity and due date fields.', 'Pending', 'emma'),
    ],
  },
];

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
        { $set: { ...profile, password, isVerified: true } },
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

    const demoEmails = DEMO_USER_DEFINITIONS.map((demoUser) => demoUser.email);
    await User.updateMany(
      { email: { $in: demoEmails } },
      { $set: { events: [], tasks: [] } }
    );

    let taskCount = 0;

    for (const definition of eventDefinitions) {
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

      await User.updateMany(
        { _id: { $in: participants.map((participant) => participant._id) } },
        { $addToSet: { events: event._id } }
      );
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
