// controllers/taskController.js
const Task = require('../models/Task');
const TaskDTO = require('../dtos/TaskDTO');
const Event = require('../models/Event');

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, event } = req.body;

    // Ensure required fields are provided
    if (!title || !assignedTo || !event) {
      return res.status(400).json({ message: 'Title, assignedTo, and event are required' });
    }

    // Create the task
    const task = new Task({
      title,
      description,
      status: status || 'Pending', // Default to 'Pending' if not provided
      assignedTo,
      event,
      createdBy: req.user.userId, // Get `createdBy` directly from `req.user`
    });

    await task.save();

    // Add the task to the event's tasks array
    const updatedEvent = await Event.findByIdAndUpdate(
      event,
      { $push: { tasks: task._id } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: new TaskDTO(task),
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find(); // Retrieve all tasks from the database
      const taskDTOs = tasks.map((task) => new TaskDTO(task)); // Map tasks to DTOs
  
      res.status(200).json({ tasks: taskDTOs });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: new TaskDTO(task),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Patch task
exports.patchTask = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body; // Partial updates from the client
  
      const task = await Task.findByIdAndUpdate(id, updates, { new: true });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({
        message: 'Task updated successfully',
        task: new TaskDTO(task),
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
