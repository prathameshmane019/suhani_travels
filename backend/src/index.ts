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
import bannersRouter from './routes/banners';
import auth from './middleware/auth'; // Import auth middleware
import mongoose from 'mongoose';
import path from 'path';

 import dotenv from 'dotenv';
    dotenv.config();  

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/suhani_bus';

if (!MONGO_URI) {
  console.error('MongoDB URI is not defined. Please set MONGO_URI in your environment variables.');
  process.exit(1);
}
 

const PORT = process.env.PORT || 4000
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express(); 

// CORS configuration - UPDATED
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL ||   'https://suhanitravels.vercel.app']
  
    : ['http://localhost:3000', 'http://localhost:3001' ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-CSRF-Token',
    'X-Api-Version'
  ],
  optionsSuccessStatus: 200
};


app.use(cors(
  corsOptions));
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
app.use('/api/banners', bannersRouter);

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
 
// Start the server
app.listen(PORT, () => {
  console.log(`Backend app listening at http://localhost:${PORT}`);
});

 export default app;