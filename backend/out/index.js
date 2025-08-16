"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const buses_1 = __importDefault(require("./routes/buses"));
const routes_1 = __importDefault(require("./routes/routes"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const refunds_1 = __importDefault(require("./routes/refunds"));
const support_1 = __importDefault(require("./routes/support"));
const adminUsers_1 = __importDefault(require("./routes/adminUsers"));
const trips_1 = __importDefault(require("./routes/trips"));
const busSchedules_1 = __importDefault(require("./routes/busSchedules"));
const auth_1 = __importDefault(require("./routes/auth")); // Import auth router
const home_1 = __importDefault(require("./routes/home"));
const agent_1 = __importDefault(require("./routes/agent")); // Import agent router Import busAuth router
const banners_1 = __importDefault(require("./routes/banners"));
const auth_2 = __importDefault(require("./middleware/auth")); // Import auth middleware
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/suhani_bus';
if (!MONGO_URI) {
    console.error('MongoDB URI is not defined. Please set MONGO_URI in your environment variables.');
    process.exit(1);
}
const PORT = process.env.PORT || 4000;
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
const app = (0, express_1.default)();
// CORS configuration - UPDATED
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || 'https://suhanitravels.vercel.app']
        : ['http://localhost:3000', 'http://localhost:3001'],
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Serve uploaded images
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// Public routes
app.use('/api/auth', auth_1.default); // Bus authentication route
app.use('/api/buses', buses_1.default);
app.use('/api/routes', routes_1.default);
app.use('/api/bus-schedules', busSchedules_1.default);
app.use('/api/trips', trips_1.default);
app.use('/api', home_1.default);
app.use('/api/banners', banners_1.default);
// Protected routes (require authentication)
app.use('/api/bookings', bookings_1.default);
app.use('/api/refunds', refunds_1.default);
app.use('/api/support', support_1.default);
app.use('/api/admin-users', adminUsers_1.default);
app.use('/api/agent', auth_2.default, agent_1.default);
app.use('/api/buses', buses_1.default);
app.use('/api/routes', routes_1.default);
app.use('/api/bus-schedules', busSchedules_1.default);
app.use('/api/trips', trips_1.default);
app.get('/', (req, res) => {
    res.send('Suhani Bus Backend API is running!');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Backend app listening at http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map