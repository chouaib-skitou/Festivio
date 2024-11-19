
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
  - React (with TypeScript)
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

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/) (for package management)
- MongoDB (local or cloud)

## Installation

### Backend

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Create an `.env` file with the following variables:
   ```plaintext
   PORT=5000
   MONGO_URI=mongodb://mongo:27017/festivio
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

3. Build and run the backend with Docker Compose:
   ```bash
   docker-compose up --build
   ```

   The backend will run on `http://localhost:5000`.

### Frontend

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create an `.env` file with the following variable:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

   The frontend will run on `http://localhost:3000`.

## Running the Application with Docker

To run both frontend and backend simultaneously using Docker Compose, navigate to the root directory (`App`) and execute:
```bash
docker-compose up --build
```

This will start:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

## Tests

### Backend

- To run backend tests, navigate to the `Backend` directory and run:
  ```bash
  npm test
  ```

### Frontend

- To run frontend tests, navigate to the `Frontend` directory and run:
  ```bash
  pnpm test
  ```

## Project Structure

```
App/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── .env
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   └── utils/
│   ├── .env
│   ├── Dockerfile
│   └── vite.config.ts
└── README.md
```

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature name'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
