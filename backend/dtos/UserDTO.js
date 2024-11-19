// dtos/UserDTO.js
class UserDTO {
    constructor(user) {
      this.id = user._id;
      this.username = user.username;
      this.email = user.email;
      this.role = user.role;
      this.isVerified = user.isVerified;
      this.createdAt = user.createdAt;
      this.updatedAt = user.updatedAt;
    }
  }
  
  module.exports = UserDTO;
  