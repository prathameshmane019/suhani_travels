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
const auth_2 = __importDefault(require("./middleware/auth")); // Import auth middleware
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/suhani_bus';
console.log(MONGO_URI);
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
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
exports.default = app;
//# sourceMappingURL=index.js.map