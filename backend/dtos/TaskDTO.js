// dtos/TaskDTO.js
class TaskDTO {
    constructor(task) {
      this.id = task._id;
      this.title = task.title;
      this.description = task.description;
      this.status = task.status;
      this.assignedTo = task.assignedTo; // Include UserDTO if needed
      this.event = task.event; // Include EventDTO if needed
      this.createdBy = task.createdBy; // Include UserDTO if needed
      this.createdAt = task.createdAt;
      this.updatedAt = task.updatedAt;
    }
  }
  
  module.exports = TaskDTO;
  