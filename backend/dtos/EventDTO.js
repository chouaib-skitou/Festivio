class EventDTO {
  constructor(event) {
    this.id = event._id;
    this.name = event.name;
    this.description = event.description;
    this.date = event.date;
    this.organizer = event.organizer;
    this.participants = event.participants;
    this.tasks = event.tasks;
    this.isOnline = Boolean(event.isOnline);
    this.zoomLink = event.zoomLink || null;
    this.imagePath = event.imagePath || null;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
  }
}

module.exports = EventDTO;
