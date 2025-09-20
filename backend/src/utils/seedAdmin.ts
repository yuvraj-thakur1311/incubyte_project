import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
if (!MONGO_URI) throw new Error('MONGO_URI not set');

mongoose.connect(MONGO_URI).then(async () => {
  const existingAdmin = await User.findOne({ email: 'admin@example.com' });
  if (existingAdmin) {
    console.log('Admin already exists.');
    mongoose.connection.close();
    return;
  }

  const hashedPassword = await bcrypt.hash('adminpassword', 10);
  const adminUser = new User({
    username: 'admin',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });

  await adminUser.save();
  console.log('Admin user seeded.');
  mongoose.connection.close();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
