class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.fullName = `${user.firstName} ${user.lastName}`; // Combine first and last name
    this.role = user.role;
    this.isVerified = user.isVerified;
    this.events = user.events || []; // Include associated events
    this.tasks = user.tasks || [];   // Include associated tasks
    this.createdAt = user.createdAt?.toISOString();
    this.updatedAt = user.updatedAt?.toISOString();
  }
}

module.exports = UserDTO;
