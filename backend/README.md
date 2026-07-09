# Backend API

This is the backend API for Web Development Project 1, built with Express, Node.js, and MongoDB (via Mongoose).

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ or v20+ recommended)
- MongoDB instance running locally or via a connection URI

### Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/web_project_db
   ```

### Running the Application

- Run in development mode (with hot reloading via `nodemon`):
  ```bash
  npm run dev
  ```

- Run in production mode:
  ```bash
  npm start
  ```
