// MUST be first - before any other imports
import dotenv from 'dotenv';
dotenv.config();

import app from "./app";
import connectDB from "./config/db"

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment check:');
    console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
    console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);
  });
};

startServer();