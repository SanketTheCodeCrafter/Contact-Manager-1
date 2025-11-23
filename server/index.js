// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { Router } from './routes/routes.js';

dotenv.config({ path: './.env' }); // load env before using process.env

const app = express();
app.use(express.json());
app.use(cors());

app.use('/contactmyst', Router);

const PORT = process.env.PORT || 5000;

// DB connect (merged from config/db.js)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;
if (!MONGO_URI) {
  console.error('Missing MongoDB URI. Set MONGO_URL or MONGO_URI in .env');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// optional: handle mongoose connection errors/events
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// graceful shutdown
const gracefulShutdown = async () => {
  await mongoose.disconnect();
  console.log('Mongoose disconnected');
  process.exit(0);
};
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

connectDB();
