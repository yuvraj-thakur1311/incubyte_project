import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from "./config/db"

const startServer = async () => {
  await connectDB();
};

startServer();

export default app; 
