# Festivio

Festivio is an event planning application designed to streamline the organization and management of events. It provides tools for event creation, participant management, task delegation, and real-time notifications, all while ensuring a user-friendly experience.

## Features

- **User Management**:
  - Registration and login system.
  - Role-based access: Organizer, Participant.
  - Secure authentication using JWT.

- **Event Management**:
  - Create, update, delete, and manage events.
  - Invite participants and manage RSVPs.

- **Task Management**:
  - Assign tasks to participants with status tracking.
  - Notification system for updates.

- **Comments and Discussions**:
  - Discussion boards for events and tasks.

- **Notifications**:
  - Real-time updates for task assignments, RSVP changes, and event updates.

## Technologies Used

- **Frontend**:
  - React (with JavaScript)
  - React Router
  - Zustand (state management)
  - Zod (schema validation)
  - Tailwind CSS (styling)

- **Backend**:
  - Node.js
  - Express
  - MongoDB (via Mongoose)
  - JWT (for authentication)

- **DevOps**:
  - Docker (containerization)
  - GitHub Actions (CI/CD)
  - Deployment on Vercel (frontend) and server for backend

## Setup Instructions

### Backend Setup

1. **MongoDB Configuration**:
   - Create a [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) or use an existing MongoDB instance.
   - Obtain the connection string and set it in the `.env` file as `MONGO_URI`.

   - Import the initial collections located in `/backend/config/utils` using the following commands:
     ```bash
     mongoimport --uri="<your_mongodb_connection_string>" --collection=users --file=backend/config/utils/users.json --jsonArray
     mongoimport --uri="<your_mongodb_connection_string>" --collection=tasks --file=backend/config/utils/tasks.json --jsonArray
     mongoimport --uri="<your_mongodb_connection_string>" --collection=events --file=backend/config/utils/events.json --jsonArray
     ```
     Replace `<your_mongodb_connection_string>` with your MongoDB Atlas connection string.

1. **Predefined User Accounts**:
   - **ROLE_PARTICIPANT**:
     - Email: `participant1@gmail.com`
     - Password: `oganizer1`

   - **ROLE_ORGANIZER_ADMIN**:
     - Email: `oganizer_admin1@gmail.com`
     - Password: `oganizer1`

   - **ROLE_ORGANIZER**:
     - Email: `oganizer1@gmail.com`
     - Password: `oganizer1`

2. **JWT Secrets**:
   - Generate secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET` using the following command:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
   - Add these to the `.env` file:
     ```env
     JWT_SECRET=<your_generated_secret>
     JWT_REFRESH_SECRET=<your_generated_refresh_secret>
     ```

3. **Mailer Setup**:
   - Use a Gmail account or any SMTP provider to send emails.
   - Enable "less secure apps" or generate an app password for Gmail.
   - Add these to the `.env` file:
     ```env
     EMAIL_USER=<your_email@example.com>
     EMAIL_PASS=<your_app_password>
     ```

4. **Environment URLs**:
   - Add the following to your `.env` file:
     ```env
     FRONTEND_URL=http://localhost:3000/
     BACKEND_URL=http://localhost:5000/
     ```

5. **Install Dependencies and Run**:
   - Navigate to the `backend` folder:
     ```bash
     cd backend
     npm install
     npm run dev
     ```
   - The backend will start at [http://localhost:5000](http://localhost:5000).

### Imgur API Setup

1. **Create an Imgur Account**:
   - Go to [Imgur's website](https://imgur.com/) and create an account if you don’t have one.

2. **Register an Application**:
   - Visit the [Imgur API registration page](https://api.imgur.com/oauth2/addclient).
   - Select **OAuth 2 without callback URL** as the application type.
   - Fill in the required details like your application name and description.
   - Submit the form to generate your **Client ID** and **Client Secret**.

3. **Configure Environment Variables**:
   - Add the following variables to your `.env` file:
     ```env
     IMGUR_CLIENT_ID=<your_imgur_client_id>
     IMGUR_CLIENT_SECRET=<your_imgur_client_secret>
     ```
   - Replace `<your_imgur_client_id>` and `<your_imgur_client_secret>` with the credentials generated in step 2.

4. **Verify the Setup**:
   - The backend will automatically use these environment variables to upload images to Imgur.

### Frontend Setup

1. **Backend URL Configuration**:
   - Add the following to the `.env` file in the `frontend` folder:
     ```env
     REACT_APP_BACKEND_URL=http://localhost:5000/
     ```

2. **Install Dependencies and Run**:
   - Navigate to the `frontend` folder:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - The frontend will start at [http://localhost:3000](http://localhost:3000).

### Docker Setup

For production or local development, you can run the project using **Docker**. Only the **frontend** is exposed publicly, while the backend is accessible internally.

1. Make sure you have **Docker** and **Docker Compose** installed on your machine.

2. Run the following command to start both the frontend and backend containers:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - The **backend** is only accessible to the frontend container and is not exposed publicly.

### Project Directory Structure

The `docker-compose.yml` file orchestrates both the frontend and backend containers. Here's a high-level overview:

```plaintext
.
├── docker-compose.yml  # Docker Compose configuration
├── backend/            # Backend code (Node.js & Express)
│   ├── Dockerfile      # Dockerfile for the backend
│   └── ...
├── frontend/           # Frontend code (React)
│   ├── Dockerfile      # Dockerfile for the frontend
│   └── ...
```

### Why the Backend is Not Exposed

The backend container is not publicly exposed for security purposes. It communicates internally with the frontend container. This setup ensures that the backend endpoints are protected from direct access.

## Final Notes

- For detailed API documentation, refer to the Swagger UI available once the backend is running.
- Ensure all environment variables are set correctly for both frontend and backend.
- Feel free to contribute to this project by submitting issues or pull requests on GitHub.

