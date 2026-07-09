import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Express Server
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
