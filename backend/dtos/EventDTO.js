// dtos/EventDTO.js
class EventDTO {
    constructor(event) {
      this.id = event._id;
      this.name = event.name;
      this.description = event.description;
      this.date = event.date;
      this.organizer = event.organizer; // Use UserDTO if organizer details are needed
      this.participants = event.participants; // Can be UserDTOs if needed
      this.tasks = event.tasks; // Include task details if needed
      this.createdAt = event.createdAt;
      this.updatedAt = event.updatedAt;
    }
  }
  
  module.exports = EventDTO;
  