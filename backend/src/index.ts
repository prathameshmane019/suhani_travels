import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import busesRouter from './routes/buses';
import routesRouter from './routes/routes';
import bookingsRouter from './routes/bookings';
import refundsRouter from './routes/refunds';
import supportRouter from './routes/support';
import adminUsersRouter from './routes/adminUsers';
import tripsRouter from './routes/trips';
import busSchedulesRouter from './routes/busSchedules'; 
import authRouter from './routes/auth'; // Import auth router
import homeRouter from './routes/home';
import agentRouter from './routes/agent'; // Import agent router Import busAuth router
import auth from './middleware/auth'; // Import auth middleware
import mongoose from 'mongoose';
import path from 'path';

 import dotenv from 'dotenv';
    dotenv.config(); // Load environment variables from .env file

    
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/suhani_bus';

console.log(MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Public routes
app.use('/api/auth', authRouter);  // Bus authentication route
app.use('/api/buses', busesRouter);
app.use('/api/routes', routesRouter);
app.use('/api/bus-schedules', busSchedulesRouter);
app.use('/api/trips', tripsRouter);
app.use('/api', homeRouter);

// Protected routes (require authentication)
app.use('/api/bookings', bookingsRouter);
app.use('/api/refunds', refundsRouter);
app.use('/api/support', supportRouter);
app.use('/api/admin-users', adminUsersRouter);
app.use('/api/agent', auth, agentRouter);

app.use('/api/buses', busesRouter);
app.use('/api/routes', routesRouter);
app.use('/api/bus-schedules', busSchedulesRouter);
app.use('/api/trips', tripsRouter);

app.get('/', (req, res) => {
  res.send('Suhani Bus Backend API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
