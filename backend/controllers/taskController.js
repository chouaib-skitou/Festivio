const mongoose = require('mongoose');
const Task = require('../models/Task');
const Event = require('../models/Event');
const User = require('../models/User');
const TaskDTO = require('../dtos/TaskDTO');
const { ROLES } = require('../constants/roles');
const {
  buildPaginationMeta,
  getPaginationParams,
} = require('../utils/pagination');

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const TASK_STATUSES = new Set(['Pending', 'In Progress', 'Completed']);

const toObjectId = (value) => {
  if (typeof value !== 'string' || !OBJECT_ID_PATTERN.test(value)) return null;
  return new mongoose.Types.ObjectId(value);
};

const sameId = (left, right) => left?.toString() === right?.toString();

const canManageEvent = (event, user) =>
  user.role === ROLES.ADMIN ||
  (user.role === ROLES.ORGANIZER_ADMIN && sameId(event.organizer, user.userId));

const findEventBySafeId = async (safeEventId) => {
  const events = await Event.find();
  return events.find((event) => sameId(event._id, safeEventId));
};

const loadManagedEvent = async (eventId, user) => {
  const safeEventId =
    eventId instanceof mongoose.Types.ObjectId ? eventId : toObjectId(eventId);
  if (!safeEventId) return { status: 400, message: 'Invalid event id' };

  const event = await findEventBySafeId(safeEventId);
  if (!event) return { status: 404, message: 'Event not found' };
  if (!canManageEvent(event, user)) {
    return { status: 403, message: 'You cannot manage tasks for this event' };
  }
  return { event };
};

const findOrganizerBySafeId = async (safeUserId) => {
  const organizers = await User.find({ role: ROLES.ORGANIZER });
  return organizers.find((user) => sameId(user._id, safeUserId));
};

const findTaskBySafeId = async (safeTaskId) => {
  const tasks = await Task.find();
  return tasks.find((task) => sameId(task._id, safeTaskId));
};

const dateValue = (value) => new Date(value || 0).getTime();

const getTaskComparator = (sort = 'newest') => {
  const comparators = {
    newest: (left, right) => dateValue(right.createdAt) - dateValue(left.createdAt),
    oldest: (left, right) => dateValue(left.createdAt) - dateValue(right.createdAt),
    status: (left, right) =>
      String(left.status || '').localeCompare(String(right.status || '')) ||
      dateValue(right.createdAt) - dateValue(left.createdAt),
  };
  return comparators[sort] || comparators.newest;
};

const loadVisibleTasks = async (user) => {
  const query = Task.find()
    .populate('assignedTo', 'firstName lastName email role')
    .populate('event', 'name date isOnline organizer');

  if (user.role === ROLES.ADMIN) return query;

  if (user.role === ROLES.ORGANIZER) {
    const organizerId = toObjectId(user.userId);
    if (!organizerId) {
      const error = new Error('Invalid authenticated user');
      error.status = 401;
      throw error;
    }

    const tasks = await query;
    return tasks.filter((task) => sameId(task.assignedTo?._id, organizerId));
  }

  if (user.role === ROLES.ORGANIZER_ADMIN) {
    const organizerId = toObjectId(user.userId);
    if (!organizerId) {
      const error = new Error('Invalid authenticated user');
      error.status = 401;
      throw error;
    }

    const tasks = await query;
    return tasks.filter((task) => sameId(task.event?.organizer, organizerId));
  }

  const error = new Error('Tasks are not available for this role');
  error.status = 403;
  throw error;
};

const taskMatchesStatus = (task, status) => {
  if (!status || status === 'All') return true;
  if (!TASK_STATUSES.has(status)) {
    const error = new Error('Invalid task status');
    error.status = 400;
    throw error;
  }
  return task.status === status;
};

const taskMatchesSearch = (task, search) => {
  const normalizedSearch = String(search || '').trim().toLowerCase();
  if (!normalizedSearch) return true;

  const eventName = typeof task.event === 'object' ? task.event?.name : '';
  const assignee = task.assignedTo || {};
  const assigneeName = `${assignee.firstName || ''} ${assignee.lastName || ''}`;
  const haystack = `${task.title || ''} ${task.description || ''} ${eventName || ''} ${assigneeName} ${assignee.email || ''}`.toLowerCase();
  return haystack.includes(normalizedSearch);
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, event: eventId } = req.body;
    if (!title || !assignedTo || !eventId) {
      return res
        .status(400)
        .json({ message: 'title, assignedTo and event are required' });
    }

    const safeAssigneeId = toObjectId(assignedTo);
    if (!safeAssigneeId) {
      return res.status(400).json({ message: 'Invalid assignee id' });
    }
    if (status !== undefined && !TASK_STATUSES.has(status)) {
      return res.status(400).json({ message: 'Invalid task status' });
    }

    const eventResult = await loadManagedEvent(eventId, req.user);
    if (!eventResult.event) {
      return res
        .status(eventResult.status)
        .json({ message: eventResult.message });
    }

    const assignee = await findOrganizerBySafeId(safeAssigneeId);
    if (!assignee) {
      return res
        .status(400)
        .json({ message: 'Tasks can only be assigned to organizers' });
    }

    const task = await Task.create({
      title: String(title).trim(),
      description:
        description === undefined ? undefined : String(description).trim(),
      status: status || 'Pending',
      assignedTo: safeAssigneeId,
      event: eventResult.event._id,
      createdBy: req.user.userId,
    });
    eventResult.event.tasks.push(task._id);
    await eventResult.event.save();

    return res.status(201).json({
      message: 'Task created successfully',
      task: new TaskDTO(task),
    });
  } catch (error) {
    console.error('Task creation failed:', error.message);
    return res.status(500).json({ message: 'Unable to create task' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, {
      defaultLimit: 10,
      maxLimit: 50,
    });
    const sort = req.query.sort || 'newest';
    const status = req.query.status || 'All';

    const visibleTasks = await loadVisibleTasks(req.user);
    const filteredTasks = visibleTasks
      .filter((task) => taskMatchesStatus(task, status))
      .filter((task) => taskMatchesSearch(task, req.query.search))
      .sort(getTaskComparator(sort));

    const paginatedTasks = filteredTasks.slice(skip, skip + limit);

    return res.json({
      tasks: paginatedTasks.map((task) => new TaskDTO(task)),
      pagination: buildPaginationMeta({ page, limit, total: filteredTasks.length }),
      filters: {
        search: req.query.search || '',
        sort,
        status,
      },
    });
  } catch (error) {
    console.error('Task listing failed:', error.message);
    return res
      .status(error.status || 500)
      .json({ message: error.status ? error.message : 'Unable to fetch tasks' });
  }
};

const updateTask = async (req, res) => {
  try {
    const safeTaskId = toObjectId(req.params.id);
    if (!safeTaskId) return res.status(400).json({ message: 'Invalid task id' });

    const task = await findTaskBySafeId(safeTaskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === ROLES.ORGANIZER) {
      if (!sameId(task.assignedTo, req.user.userId)) {
        return res
          .status(403)
          .json({ message: 'You can only update your assigned tasks' });
      }
      const keys = Object.keys(req.body);
      if (keys.length !== 1 || keys[0] !== 'status') {
        return res
          .status(403)
          .json({ message: 'Organizers can only update task status' });
      }
      if (!TASK_STATUSES.has(req.body.status)) {
        return res.status(400).json({ message: 'Invalid task status' });
      }
      task.status = req.body.status;
    } else {
      const eventResult = await loadManagedEvent(task.event, req.user);
      if (!eventResult.event) {
        return res
          .status(eventResult.status)
          .json({ message: eventResult.message });
      }

      if (req.body.title !== undefined) task.title = String(req.body.title).trim();
      if (req.body.description !== undefined) {
        task.description = String(req.body.description).trim();
      }
      if (req.body.status !== undefined) {
        if (!TASK_STATUSES.has(req.body.status)) {
          return res.status(400).json({ message: 'Invalid task status' });
        }
        task.status = req.body.status;
      }
      if (req.body.assignedTo !== undefined) {
        const safeAssigneeId = toObjectId(req.body.assignedTo);
        if (!safeAssigneeId) {
          return res.status(400).json({ message: 'Invalid assignee id' });
        }
        const assignee = await findOrganizerBySafeId(safeAssigneeId);
        if (!assignee) {
          return res
            .status(400)
            .json({ message: 'Tasks can only be assigned to organizers' });
        }
        task.assignedTo = safeAssigneeId;
      }
    }

    await task.save();
    return res.json({
      message: 'Task updated successfully',
      task: new TaskDTO(task),
    });
  } catch (error) {
    console.error('Task update failed:', error.message);
    return res.status(500).json({ message: 'Unable to update task' });
  }
};

exports.updateTask = updateTask;
exports.patchTask = updateTask;

exports.deleteTask = async (req, res) => {
  try {
    const safeTaskId = toObjectId(req.params.id);
    if (!safeTaskId) return res.status(400).json({ message: 'Invalid task id' });

    const task = await findTaskBySafeId(safeTaskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const eventResult = await loadManagedEvent(task.event, req.user);
    if (!eventResult.event) {
      return res
        .status(eventResult.status)
        .json({ message: eventResult.message });
    }

    await task.deleteOne();
    eventResult.event.tasks = eventResult.event.tasks.filter(
      (taskId) => !sameId(taskId, task._id)
    );
    await eventResult.event.save();
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Task deletion failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete task' });
  }
};
