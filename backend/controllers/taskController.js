const mongoose = require('mongoose');
const Task = require('../models/Task');
const Event = require('../models/Event');
const User = require('../models/User');
const TaskDTO = require('../dtos/TaskDTO');
const { ROLES } = require('../constants/roles');

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const TASK_STATUSES = new Set(['Pending', 'In Progress', 'Completed']);

const toObjectId = (value) => {
  if (typeof value !== 'string' || !OBJECT_ID_PATTERN.test(value)) return null;
  return new mongoose.Types.ObjectId(value);
};

const canManageEvent = (event, user) =>
  user.role === ROLES.ADMIN ||
  (user.role === ROLES.ORGANIZER_ADMIN &&
    event.organizer.toString() === user.userId);

const loadManagedEvent = async (eventId, user) => {
  const safeEventId =
    eventId instanceof mongoose.Types.ObjectId ? eventId : toObjectId(eventId);
  if (!safeEventId) return { status: 400, message: 'Invalid event id' };

  const event = await Event.findById(safeEventId);
  if (!event) return { status: 404, message: 'Event not found' };
  if (!canManageEvent(event, user)) {
    return { status: 403, message: 'You cannot manage tasks for this event' };
  }
  return { event };
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

    const assignee = await User.findById(safeAssigneeId);
    if (!assignee || assignee.role !== ROLES.ORGANIZER) {
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
    let filter = {};
    if (req.user.role === ROLES.ORGANIZER) {
      filter = { assignedTo: toObjectId(req.user.userId) };
    } else if (req.user.role === ROLES.ORGANIZER_ADMIN) {
      const organizerId = toObjectId(req.user.userId);
      if (!organizerId) {
        return res.status(401).json({ message: 'Invalid authenticated user' });
      }
      const eventIds = await Event.find({ organizer: organizerId }).distinct('_id');
      filter = { event: { $in: eventIds } };
    } else if (req.user.role !== ROLES.ADMIN) {
      return res
        .status(403)
        .json({ message: 'Tasks are not available for this role' });
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'firstName lastName email role')
      .sort({ createdAt: -1 });
    return res.json({ tasks: tasks.map((task) => new TaskDTO(task)) });
  } catch (error) {
    console.error('Task listing failed:', error.message);
    return res.status(500).json({ message: 'Unable to fetch tasks' });
  }
};

const updateTask = async (req, res) => {
  try {
    const safeTaskId = toObjectId(req.params.id);
    if (!safeTaskId) return res.status(400).json({ message: 'Invalid task id' });

    const task = await Task.findById(safeTaskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === ROLES.ORGANIZER) {
      if (task.assignedTo.toString() !== req.user.userId) {
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
        const assignee = await User.findById(safeAssigneeId);
        if (!assignee || assignee.role !== ROLES.ORGANIZER) {
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

    const task = await Task.findById(safeTaskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const eventResult = await loadManagedEvent(task.event, req.user);
    if (!eventResult.event) {
      return res
        .status(eventResult.status)
        .json({ message: eventResult.message });
    }

    await task.deleteOne();
    eventResult.event.tasks = eventResult.event.tasks.filter(
      (taskId) => taskId.toString() !== task._id.toString()
    );
    await eventResult.event.save();
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Task deletion failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete task' });
  }
};
