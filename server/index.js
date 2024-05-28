// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './config/db.js'; // Ensure the MongoDB connection is established here
import { Router } from './routes/routes.js';

dotenv.config({ path: './config/.env' });

const app = express();
app.use(express.json());
app.use(cors());

app.use('/contactmyst', Router);

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
});
